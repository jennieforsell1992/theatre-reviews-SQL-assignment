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
