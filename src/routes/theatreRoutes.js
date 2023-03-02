const express = require("express");
const router = express.Router();
const { userRoles } = require("../constants/users");
const {
  getTheatreById,
  getAllTheatresInCity,
  createNewTheatre,
} = require("../controllers/theatreController");
const {
  isAuthenticated,
  authorizeRoles,
} = require("../middleware/authenticationMiddleware");

//get all theatres
router.get(":cityId", getAllTheatresInCity);

//Get theatre by city id and theatre id
router.get(":cityId/:theatreId", getTheatreById);
router.post(
  "/:cityId",
  isAuthenticated,
  authorizeRoles(userRoles.OWNER),
  createNewTheatre
);
router.put(":cityId/:theatreId");
router.delete(":cityId/:theatreId");

module.exports = router;
