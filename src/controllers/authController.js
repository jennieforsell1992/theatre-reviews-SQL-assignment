const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { UnauthorizedError, BadRequestError } = require("../utils/errors");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  const { username, password, email, role } = req.body;

  if (!username || !password || !email || !role) {
    throw new BadRequestError(
      "You must provide a username, a password, an email, and a role!"
    );
  }

  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  //Checks if users already exist
  const [results, metadata] = await sequelize.query(
    "SELECT id FROM user LIMIT 1;"
  );

  //Add user to DB
  await sequelize.query(
    "INSERT INTO user (username, password, email, role) VALUES ($username, $password, $email, $role);",
    {
      bind: {
        password: hashedpassword,
        email: email,
        username: username,
        role: role,
      },
    }
  );

  return res.status(201).json({
    message: "Registration succeeded. You can now log in.",
  });
};
