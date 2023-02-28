const express = require("express");
const router = express.Router();

//get all theatres
router.get("/:cityId");
router.get("/:cityId/:theatreId");
router.post("/:cityId");
router.put("/:cityId/:theatreId");
router.delete("/:cityId/:theatreId");

module.exports = router;
