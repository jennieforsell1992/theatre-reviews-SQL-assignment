const express = require("express");
const router = express.Router();
const { userRoles } = require("../constants/users");
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
const {
  isAuthenticated,
  authorizeRoles,
} = require("../middleware/authenticationMiddleware");

//get all theatres
router.get("/", getAllTheatres);

//Get theatre by theatre id
router.get("/:theatreId", getTheatreById);
router.post(
  "/",
  isAuthenticated,
  authorizeRoles(userRoles.OWNER),
  createNewTheatre
);

//Update theatre
router.put(
  "/:theatreId",
  isAuthenticated,
  authorizeRoles(userRoles.OWNER),
  updateTheatre
);
router.delete("/:theatreId", isAuthenticated, deleteTheatre);

router.get("/:theatreId/reviews", getAllReviewsFromTheatre);
router.get("/:theatreId/reviews/:reviewId", getReviewById);
router.post("/:theatreId/reviews", isAuthenticated, createReview);
router.put("/:theatreId/reviews/:reviewId", isAuthenticated, updateReview);
router.delete("/:theatreId/reviews/:reviewId", isAuthenticated, deleteReview);

module.exports = router;
