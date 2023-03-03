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

router.get("/:theatreId/reviews", getAllReviewsFromTheatre);
router.get("/:theatreId/reviews/:reviewId", getReviewById);
router.post("/:theatreId/reviews", isAuthenticated, createReview);
router.put("/:theatreId/reviews/:reviewId", isAuthenticated, updateReview);
router.delete("/:theatreId/reviews/:reviewId", isAuthenticated, deleteReview);

module.exports = router;
