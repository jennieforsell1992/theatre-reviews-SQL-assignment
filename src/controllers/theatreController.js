const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { UnauthorizedError, NotFoundError } = require("../utils/errors");

exports.getTheatreById = async (req, res) => {
  try {
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
  } catch (error) {
    return error;
  }
};

exports.getAllTheatresInCity = async (req, res) => {
  try {
    const cityId = req.params.cityId;

    const [theatres, metadata] = await sequelize.query(
      "SELECT * FROM theatre WHERE fk_city_id = $cityId;",
      {
        bind: { cityId },
        type: QueryTypes.SELECT,
      }
    );

    return res.send(theatres);
  } catch (error) {
    return error;
  }
};

exports.createNewTheatre = async (req, res) => {
  try {
    const { theatreName, address, phoneNumber, desc, email, owner, city } =
      req.body;

    await sequelize.query(
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
    return res.status(201).json({
      message: `Theatre ${theatreName} added.`,
    });
  } catch (error) {
    return null;
  }
};
