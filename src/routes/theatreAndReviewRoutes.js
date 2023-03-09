const express = require("express");
const router = express.Router();
const {
  getTheatreById,
  getAllTheatres,
  createNewTheatre,
  updateTheatre,
  deleteTheatre,
} = require("../controllers/theatreController");
const {
  getAllReviewsFromTheatre,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");

/* Theatres */
router.get("/", getAllTheatres);
router.get("/:theatreId", getTheatreById);
router.post("/", isAuthenticated, createNewTheatre);
router.put("/:theatreId", isAuthenticated, updateTheatre);
router.delete("/:theatreId", isAuthenticated, deleteTheatre);

/* Reviews */
router.get("/:theatreId/reviews", getAllReviewsFromTheatre);
router.get("/:theatreId/reviews/:reviewId", getReviewById);
router.post("/:theatreId/reviews", isAuthenticated, createReview);
router.put("/:theatreId/reviews/:reviewId", isAuthenticated, updateReview);
router.delete("/:theatreId/reviews/:reviewId", isAuthenticated, deleteReview);

module.exports = router;
