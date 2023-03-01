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

router.get("/", getAllUsers);
router.get("/:userId", getUserById);
//router.post("/", createNewUser);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUserById);

module.exports = router;
