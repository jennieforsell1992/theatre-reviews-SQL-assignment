const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { UnauthorizedError } = require("../utils/errors");
const { userRoles } = require("../constants/users");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
  const [users, metadata] = await sequelize.query("SELECT * FROM user;");

  return res.send(users);
};

exports.getUserById = async (req, res) => {
  const userId = req.params.userId;

  const [user, metadata] = await sequelize.query(
    "SELECT * FROM user WHERE id = $userId;",
    {
      bind: { userId },
      type: QueryTypes.SELECT,
    }
  );

  return res.send(user);
};

exports.updateUser = async (req, res) => {
  const userId = req.params.userId;

  let { username, password, email, role } = req.body;

  //ADMIN kan ändra alla konton, medans OWNER & USER kan endast ändra sina egna konto-uppgifter
  if (userId != req.user?.userId && req.user.role !== userRoles.ADMIN) {
    throw new UnauthorizedError("You can only update your own account");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  const [updatedUser, metadata] = await sequelize.query(
    `UPDATE user SET username = $username, password = $password, email = $email, role = $role WHERE id = $userId RETURNING *;`,
    {
      bind: {
        userId: userId,
        username: username,
        password: hashedpassword,
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

  //ADMIN kan ta bort alla konton, medans OWNER & USER kan bara ta bort sitt egna konto och inte någon annans.
  if (userId != req.user?.userId && req.user.role !== userRoles.ADMIN) {
    throw new UnauthorizedError("You can only delete your own account");
  }

  const [results, metadata] = await sequelize.query(
    "DELETE FROM user WHERE id = $userId RETURNING *",
    {
      bind: { userId },
    }
  );

  return res.sendStatus(204);
};
