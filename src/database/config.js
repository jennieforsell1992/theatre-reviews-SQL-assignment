const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize("theatreReviewsDB", "", "", {
  dialect: "sqlite",
  storage: path.join(__dirname, "theatreReviewsDB.sqlite"),
});

module.exports = {
  sequelize,
};
