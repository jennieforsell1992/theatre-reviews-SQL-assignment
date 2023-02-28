const express = require("express");
const router = express.Router();

//get all reviews
router.get("/:cityId/:theatreId/reviews");
router.get("/:cityId/:theatreId/reviews/:reviewId");
router.post("/:cityId/:theatreId/reviews");
router.put("/:cityId/:theatreId/reviews/:reviewId");
router.delete("/:cityId/:theatreId/reviews/:reviewId");

module.exports = router;
