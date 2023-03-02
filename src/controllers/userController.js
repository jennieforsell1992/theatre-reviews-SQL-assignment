const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { UnauthorizedError } = require("../utils/errors");
const { userRoles } = require("../constants/users");

exports.getAllUsers = async (req, res) => {
  try {
    const [users, metadata] = await sequelize.query("SELECT * FROM user;");
    console.log(users);
    return res.send(users);
  } catch (error) {
    return null;
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;

    const [user, metadata] = await sequelize.query(
      "SELECT * FROM user WHERE id = $userId;",
      {
        bind: { userId },
        type: QueryTypes.SELECT,
      }
    );

    return res.send(user);
  } catch (error) {
    return error;
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.params.userId;

  const { username, password, email, role } = req.body;

  if (username) username = username;
  if (password) password = password;
  if (email) email = email;
  if (role) role = role;

  const [updatedUser, metadata] = await sequelize.query(
    `UPDATE user SET (username = $username, password = $password, email = $email, role = $role) WHERE id = $userId RETURNING *`,
    {
      bind: {
        userId: userId,
        username: username,
        password: password,
        email: email,
        role: role,
      },
      type: QueryTypes.UPDATE,
    }
  );

  return res.sendStatus(201).send(updatedUser);
};

exports.deleteUserById = async (req, res) => {
  const userId = req.params.userId;

  if (userId != req.user?.userId) {
    throw new UnauthorizedError("Can only delete your own account");
  }

  const [results, metadata] = await sequelize.query(
    "DELETE FROM user WHERE id = $userId RETURNING *",
    {
      bind: { userId },
    }
  );

  return res.sendStatus(204);
};
