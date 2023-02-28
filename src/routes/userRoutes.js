const express = require("express");
const { userRoles } = require("../constants/users");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createNewUser,
  updateUser,
  deleteUserById,
} = require("../controllers/userController");

router.get("/users", getAllUsers);
router.get("/users/:userId", getUserById);
router.post("/users", createNewUser);
router.put("/users/:userId", updateUser);
router.delete("/users/:userId", deleteUserById);
