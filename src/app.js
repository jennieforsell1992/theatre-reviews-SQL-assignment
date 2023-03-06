require("dotenv").config();
require("express-async-errors");
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const theatreRoutes = require("./routes/theatreAndReviewRoutes");
const userRoutes = require("./routes/userRoutes");
const { errorMiddleware } = require("./middleware/errorMiddleware");
const { notFoundMiddleware } = require("./middleware/notFoundMiddleware");
const { sequelize } = require("./database/config");

/* Create app */
const app = express();

/* Middleware */

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Processing ${req.method} request to ${req.path}`);
  next();
});

/* Routes */

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/theatres", theatreRoutes);

/* Error Handling */
app.use(notFoundMiddleware);
app.use(errorMiddleware);

/* Server Setup */

const port = process.env.PORT;
const run = async () => {
  try {
    await sequelize.authenticate();

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

run();
