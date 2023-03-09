const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { UnauthorizedError, NotFoundError } = require("../utils/errors");
const jwt = require("jsonwebtoken");
const { userRoles } = require("../constants/users");

exports.getTheatreById = async (req, res) => {
  const theatreId = req.params.theatreId;

  const [theatre, metadata] = await sequelize.query(
    "SELECT * FROM theatre WHERE id = $theatreId;",
    {
      bind: { theatreId },
      type: QueryTypes.SELECT,
    }
  );

  return res.send(theatre);
};

exports.getAllTheatres = async (req, res) => {
  const { cityId } = req.body;

  if (cityId) {
    const [theatres, metadata] = await sequelize.query(
      "SELECT * FROM theatre WHERE fk_city_id = $cityId",
      {
        bind: { cityId },
      }
    );
    return res.send(theatres);
  } else {
    const [theatres, metadata] = await sequelize.query(
      "SELECT * FROM theatre LIMIT 10"
    );
    return res.send(theatres);
  }
};

exports.createNewTheatre = async (req, res) => {
  const { theatreName, address, phoneNumber, desc, email, owner, city } =
    req.body;

  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const userId = payload.userId;
  const role = payload.role;

  if (role === userRoles.ADMIN || userRoles.OWNER) {
    const [newTheatreId] = await sequelize.query(
      `INSERT INTO theatre (theatreName, address, phoneNumber, desc, email, fk_user_id, fk_city_id)
          VALUES
          ($theatreName, $address, $phoneNumber, $desc, $email, (SELECT id FROM user WHERE username = $owner), (SELECT id FROM city WHERE cityname = $city));
          `,
      {
        bind: {
          theatreName: theatreName,
          address: address,
          phoneNumber: phoneNumber,
          desc: desc,
          email: email,
          owner: owner,
          city: city,
        },
      }
    );

    return res
      .setHeader(
        "Location",
        `${req.protocol}://${req.headers.host}/api/v1/${newTheatreId}`
      )
      .status(201)
      .json({
        message: `Theatre ${theatreName} added.`,
      });
  } else {
    throw new UnauthorizedError(
      "You must be either ADMIN or OWNER to add a new theatre"
    );
  }
};

exports.updateTheatre = async (req, res) => {
  const theatreId = req.params.theatreId;

  const { theatreName, address, phoneNumber, desc, email, owner, city } =
    req.body;

  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const userId = payload.userId;
  const role = payload.role;

  if (role === userRoles.ADMIN) {
    const [updatedTheatre, metadata] = await sequelize.query(
      `UPDATE theatre SET theatreName = $theatreName, address = $address, phoneNumber = $phoneNumber, desc = $desc, email = $email, fk_user_id = (SELECT id FROM user WHERE userName = $owner), fk_city_id = (SELECT id FROM city WHERE cityName = $city) WHERE id = $theatreId AND fk_user_id = $userId RETURNING *;`,
      {
        bind: {
          theatreId,
          theatreName: theatreName,
          address: address,
          phoneNumber: phoneNumber,
          desc: desc,
          email: email,
          owner: owner,
          city: city,
          userId,
        },
        type: QueryTypes.UPDATE,
      }
    );
    return res.sendStatus(200);
  } else {
    const [theatreToUpdateUserId, theatreMetadata] = await sequelize.query(
      `SELECT fk_user_id FROM theatre WHERE id = $theatreId AND fk_user_id = $userId;`,
      {
        bind: {
          theatreId,
          userId,
        },
        type: QueryTypes.SELECT,
      }
    );

    if (!theatreToUpdateUserId) {
      throw new UnauthorizedError(
        "Sorry, you don't have the right access to do this."
      );
    }

    if (theatreToUpdateUserId.fk_user_id === userId) {
      const [updatedTheatre, metadata] = await sequelize.query(
        `UPDATE theatre SET theatreName = $theatreName, address = $address, phoneNumber = $phoneNumber, desc = $desc, email = $email, fk_user_id = (SELECT id FROM user WHERE userName = $owner), fk_city_id = (SELECT id FROM city WHERE cityName = $city) WHERE id = $theatreId AND fk_user_id = $userId RETURNING *;`,
        {
          bind: {
            theatreId,
            theatreName: theatreName,
            address: address,
            phoneNumber: phoneNumber,
            desc: desc,
            email: email,
            owner: owner,
            city: city,
            userId: userId,
          },
          type: QueryTypes.UPDATE,
        }
      );
    }
    return res.sendStatus(200);
  }
};

exports.deleteTheatre = async (req, res) => {
  const theatreId = req.params.theatreId;

  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const userId = payload.userId;
  const role = payload.role;

  if (role === userRoles.ADMIN) {
    await sequelize.query(
      `DELETE FROM theatre WHERE id = $theatreId RETURNING *;`,
      {
        bind: {
          theatreId,
        },
        type: QueryTypes.DELETE,
      }
    );
  } else {
    const [theatreToDeleteUserId, theatreMetadata] = await sequelize.query(
      `SELECT fk_user_id FROM theatre WHERE id = $theatreId AND fk_user_id = $userId;`,
      {
        bind: {
          theatreId,
          userId,
        },
        type: QueryTypes.SELECT,
      }
    );

    if (theatreToDeleteUserId === undefined) {
      throw new UnauthorizedError(
        "Sorry, you don't have the right access to do this."
      );
    }

    if (theatreToDeleteUserId.fk_user_id !== userId) {
      throw new UnauthorizedError(
        "Sorry, you don't have the right access to do this."
      );
    }

    await sequelize.query(
      `DELETE FROM theatre WHERE id = $theatreId AND fk_user_id = $userId RETURNING *;`,
      {
        bind: {
          theatreId,
          userId,
        },
        type: QueryTypes.DELETE,
      }
    );
  }

  return res.json("Theatre deleted!").sendStatus(204);
};
