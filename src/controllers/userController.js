const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { UnauthorizedError } = require("../utils/errors");
const { userRoles } = require("../constants/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getAllUsers = async (req, res) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const userId = payload.userId;
  const role = payload.role;

  if (role !== userRoles.ADMIN) {
    throw new UnauthorizedError("Only an admin can see all users");
  }

  const [users, metadata] = await sequelize.query(
    "SELECT * FROM user LIMIT 10;"
  );

  return res.send(users);
};

exports.getUserById = async (req, res) => {
  const userId = req.params.userId;

  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const role = payload.role;

  if (role !== userRoles.ADMIN) {
    throw new UnauthorizedError("Only an admin can see any users");
  }

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

  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const jwtUserId = payload.userId;
  const jwtRole = payload.role;

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  if (jwtRole === userRoles.ADMIN) {
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
    return res
      .sendStatus(200)
      .send(updatedUser + "Updated with admin privileges");
  } else {
    if (email || role) {
      throw new UnauthorizedError(
        "Only an admin can change your role and email"
      );
    }

    if (jwtUserId != userId) {
      throw new UnauthorizedError("You can only update your own account");
    }

    const [updatedUser, metadata] = await sequelize.query(
      `UPDATE user SET username = $username, password = $password WHERE id = $userId RETURNING *;`,
      {
        bind: {
          userId: userId,
          username: username,
          password: hashedpassword,
        },
        type: QueryTypes.UPDATE,
      }
    );
    return res.sendStatus(200).send(updatedUser);
  }
};

exports.deleteUserById = async (req, res) => {
  const userId = req.params.userId;

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
