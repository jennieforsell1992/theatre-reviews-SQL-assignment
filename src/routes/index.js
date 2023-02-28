const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const theatreRoutes = require("./theatreRoutes");
const reviewRoutes = require("./reviewRoutes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/theatres", theatreRoutes);
router.use("/reviews", reviewRoutes);

module.exports = router;
