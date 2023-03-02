const express = require("express");
const { userRoles } = require("../constants/users");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUserById,
} = require("../controllers/userController");
const {
  isAuthenticated,
  authorizeRoles,
} = require("../middleware/authenticationMiddleware");

router.get("/", isAuthenticated, authorizeRoles(userRoles.ADMIN), getAllUsers);
router.get(
  "/:userId",
  isAuthenticated,
  authorizeRoles(userRoles.ADMIN),
  getUserById
);
router.put("/:userId", isAuthenticated, updateUser);
router.delete("/:userId", isAuthenticated, deleteUserById);

module.exports = router;
