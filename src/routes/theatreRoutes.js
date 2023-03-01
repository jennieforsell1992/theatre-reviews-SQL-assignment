const express = require("express");
const router = express.Router();
const {
  getTheatreById,
  getAllTheatresInCity,
} = require("../controllers/theatreController");

//get all theatres
router.get("/:cityId", getAllTheatresInCity);

//Get theatre by city id and theatre id
router.get("/:cityId/:theatreId", getTheatreById);
router.post("/:cityId");
router.put("/:cityId/:theatreId");
router.delete("/:cityId/:theatreId");

module.exports = router;
