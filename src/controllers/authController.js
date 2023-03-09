const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const {
  BadRequestError,
  UnauthenticatedError,
  ValidationError,
} = require("../utils/errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { username, password, email, role } = req.body;

  if (!username || !password || !email || !role) {
    throw new BadRequestError(
      "You must provide a username, a password, an email, and a role!"
    );
  }

  const [results, metadata] = await sequelize.query(
    "SELECT email FROM user WHERE email = $email;",
    {
      bind: {
        email: email,
      },
    }
  );

  if (results.length > 0) {
    throw new ValidationError("Sorry, this email is already in use!");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

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

  const [user, metadata] = await sequelize.query(
    "SELECT * FROM user WHERE email = $email LIMIT 1;",
    {
      bind: { email },
      type: QueryTypes.SELECT,
    }
  );

  if (!user) throw new UnauthenticatedError("Invalid Credentials");

  const isPasswordCorrect = await bcrypt.compare(
    candidatePassword,
    user.password
  );

  if (!isPasswordCorrect) throw new UnauthenticatedError("Invalid Credentials");

  const jwtPayload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return res.json({ token: jwtToken, user: jwtPayload });
};
