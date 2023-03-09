const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUserById,
} = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");

router.get("/", isAuthenticated, getAllUsers);
router.get("/:userId", isAuthenticated, getUserById);
router.put("/:userId", isAuthenticated, updateUser);
router.delete("/:userId", isAuthenticated, deleteUserById);

module.exports = router;
