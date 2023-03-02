const express = require("express");
const router = express.Router();
const {
  getAllReviewsFromTheatre,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const {
  isAuthenticated,
  authorizeRoles,
} = require("../middleware/authenticationMiddleware");

//get all reviews
router.get("/:theatreId/reviews", getAllReviewsFromTheatre);
//Get review by Id from theatre
router.get("/:theatreId/reviews/:reviewId", getReviewById);
router.post("/:theatreId/reviews", createReview);
router.put(":cityId/:theatreId/reviews/:reviewId");
router.delete(":cityId/:theatreId/reviews/:reviewId");

module.exports = router;
