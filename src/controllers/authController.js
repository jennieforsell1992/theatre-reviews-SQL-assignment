const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const {
  UnauthorizedError,
  BadRequestError,
  UnauthenticatedError,
} = require("../utils/errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRoles = require("../constants/users");

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

exports.login = async (req, res) => {
  const { email, password: candidatePassword } = req.body;

  if (!email) {
    throw new BadRequestError("You must provide an email and a password!");
  }

  //Check if email in DB
  const [user, metadata] = await sequelize.query(
    "SELECT * FROM user WHERE email = $email LIMIT 1;",
    {
      bind: { email },
      type: QueryTypes.SELECT,
    }
  );

  console.log(user);

  if (!user) throw new UnauthenticatedError("Invalid Credentials");

  //Check if password is correct

  const isPasswordCorrect = await bcrypt.compare(
    candidatePassword,
    user.password
  );

  if (!isPasswordCorrect) throw new UnauthenticatedError("Invalid Credentials");

  //Create JWT payload
  const jwtPayload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user["role"] === "ADMIN" ? userRoles.ADMIN : userRoles.USER,
  };

  const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return res.json({ token: jwtToken, user: jwtPayload });

  return res.send("Du är inloggad!");
};
