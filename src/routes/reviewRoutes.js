<<<<<<< HEAD
const express = require("express");
const { userRoles } = require("../constants/users");
=======
/* const express = require("express");
>>>>>>> 54a503644ff95b5a99d4974c6ab00cf96ab6471c
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

<<<<<<< HEAD
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
=======
router.get("/:theatreId/reviews", getAllReviewsFromTheatre);
router.get("/:theatreId/reviews/:reviewId", getReviewById);
router.post("/:theatreId/reviews", isAuthenticated, createReview);
router.put("/:theatreId/reviews/:reviewId", isAuthenticated, updateReview);
router.delete("/:theatreId/reviews/:reviewId", isAuthenticated, deleteReview);
>>>>>>> 54a503644ff95b5a99d4974c6ab00cf96ab6471c

module.exports = router;
 */
