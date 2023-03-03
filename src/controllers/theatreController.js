const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { UnauthorizedError, NotFoundError } = require("../utils/errors");

exports.getTheatreById = async (req, res) => {
  const theatreId = req.params.theatreId;
  const cityId = req.params.cityId;

  const [theatre, metadata] = await sequelize.query(
    "SELECT * FROM theatre WHERE fk_city_id = $cityId AND id = $theatreId;",
    {
      bind: { theatreId, cityId },
      type: QueryTypes.SELECT,
    }
  );

  return res.send(theatre);
};

exports.getAllTheatres = async (req, res) => {
  const cityId = req.params.cityId;

  const [theatres, metadata] = await sequelize.query(
    "SELECT * FROM theatre WHERE fk_city_id = $cityId;",
    {
      bind: { cityId },
    }
  );

  return res.send(theatres);
};

exports.createNewTheatre = async (req, res) => {
  const { theatreName, address, phoneNumber, desc, email, owner, city } =
    req.body;

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
      `${req.protocol}://${req.headers.host}/api/v1/:cityId/${newTheatreId}`
    )
    .status(201)
    .json({
      message: `Theatre ${theatreName} added.`,
    });
};

exports.updateTheatre = async (req, res) => {
  const theatreId = req.params.theatreId;

  const { theatreName, address, phoneNumber, desc, email, owner, city } =
    req.body;

  const userId = req.user?.userId;
  console.log(req.user?.role);

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

  return res.sendStatus(200).send(updatedTheatre);
};

exports.deleteTheatre = async (req, res) => {
  const theatreId = req.params.theatreId;

  const userId = req.user?.userId;
  console.log(req.user?.role);

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

  if (!theatreToDeleteUserId) {
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

  return res.json("Theatre deleted!").sendStatus(204);
};
