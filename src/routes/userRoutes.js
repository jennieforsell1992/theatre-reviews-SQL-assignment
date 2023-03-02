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
const {
  isAuthenticated,
  authorizeRoles,
} = require("../middleware/authenticationMiddleware");

router.get("/", isAuthenticated, authorizeRoles(userRoles.ADMIN), getAllUsers);
router.get("/:userId", getUserById);
//router.post("/", createNewUser);
router.put("/:userId", updateUser);
router.delete("/:userId", isAuthenticated, deleteUserById);

module.exports = router;
