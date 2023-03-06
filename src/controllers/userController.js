const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { UnauthorizedError } = require("../utils/errors");
const { userRoles } = require("../constants/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

  //Get username from token
  let token;
  // Grab the Authorization header
  const authHeader = req.headers.authorization;

  // Check it contains JWT token and extract the token
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  // Get userId from token
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const jwtUserId = payload.userId;
  const jwtRole = payload.role;
  console.log(jwtUserId);
  console.log(userId);

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
