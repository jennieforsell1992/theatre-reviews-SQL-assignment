const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { UnauthorizedError } = require("../utils/errors");

exports.getAllreviews = async (req, res) => {
  try {
    const [reviews, metadata] = await sequelize.query("SELECT * FROM review");
    console.log(reviews);
    return res.send(reviews);
  } catch (error) {
    return null;
  }
};
