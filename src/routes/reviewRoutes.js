const express = require("express");
const { userRoles } = require("../constants/users");
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

router.get("/:theatreId/reviews", isAuthenticated, getAllReviewsFromTheatre);
router.get("/:theatreId/reviews/:reviewId", isAuthenticated, getReviewById);
router.post("/:theatreId/reviews", isAuthenticated, createReview);
router.put("/:theatreId/reviews/:reviewId", isAuthenticated, updateReview);
router.delete(
  "/:theatreId/reviews/:reviewId",
  isAuthenticated,
  authorizeRoles(userRoles.OWNER),
  deleteReview
);

module.exports = router;
