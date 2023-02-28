const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { UnauthorizedError } = require("../utils/errors");

exports.getAllUsers = async (req, res) => {
  try {
    const [users, metadata] = await sequelize.query(
      "SELECT id, username, email, role FROM users"
    );
    console.log(users);
    return res.json(users);
  } catch (error) {
    return null;
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;

    const [user, metadata] = await sequelize.query(
      "SELECT id, username, email, role FROM users WHERE id = $userId",
      {
        bind: { userId },
        type: QueryTypes.SELECT,
      }
    );

    return res.json(user);
  } catch (error) {
    return null;
  }
};

exports.createNewUser = async (req, res) => {
  const user = req.body.user;

  const [newUserId] = await sequelize.query(
    "INSERT INTO user user VALUES $user;",
    {
      bind: { user: user },
      type: QueryTypes.INSERT,
    }
  );

  return res.json(newUserId);
};

exports.updateUser = async (req, res) => {
  const user = req.body.user;
  const userId = req.params.userId || req.body.userId;

  const [updatedTodoId] = await sequelize.query(
    `UPDATE user SET "" WHERE id = userId RETURNING *`,
    {
      bind: { user: user, userId: userId },
      type: QueryTypes.UPDATE,
    }
  );

  // prettier-ignore
  return res
    .setHeader('Location', `${req.protocol}://${req.headers.host}/api/v1/lists/${newTodoId}`)
    .sendStatus(201)
};

exports.deleteUserById = async (req, res) => {
  const userId = req.params.userId;

  if (userId != req.user?.userId) {
    throw new UnauthorizedError("Can only delete your own account");
  }

  const [results, metadata] = await sequelize.query(
    "DELETE FROM users WHERE id = $userId RETURNING *",
    {
      bind: { userId },
    }
  );

  return res.sendStatus(204);
};
