const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { UnauthorizedError, BadRequestError } = require("../utils/errors");
const { cityId } = require("../constants/cities");

exports.getAllReviewsFromTheatre = async (req, res) => {
  try {
    const theatreId = req.params.theatreId;

    const [reviews, metadata] = await sequelize.query(
      "SELECT * FROM review WHERE fk_theatre_id = $theatreId;",
      {
        bind: { theatreId },
        // type: QueryTypes.SELECT,
      }
    );
    console.log(reviews);

    return res.send(reviews);
  } catch (error) {
    return null;
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const theatreId = req.params.theatreId;
    const reviewId = req.params.reviewId;

    const [review, metadata] = await sequelize.query(
      "SELECT * FROM review WHERE fk_theatre_id = $theatreId AND id = $reviewId",
      {
        bind: { theatreId, reviewId },
      }
    );

    return res.send(review);
  } catch (error) {
    return error;
  }
};

exports.createReview = async (req, res) => {
  try {
    const { mainText, rating, username } = req.body;
    const theatre = req.params.theatreId;

    console.log(theatre);
    console.log(req.body);

    //Get username from token

    if (!mainText || !rating) {
      throw new BadRequestError(
        "You have to provide a text for your review, and a rating!"
      );
    }

    /* if (rating > 5) {
      throw new BadRequestError("You have to rate the theatre between 1 and 5");
    } */

    await sequelize.query(
      `INSERT INTO review (mainText, rating, fk_user_id, fk_theatre_id)
      VALUES
      ($mainText, $rating, (SELECT id FROM user WHERE username = $username), 
      (SELECT id FROM theatre WHERE id = $theatreId));`,
      {
        bind: {
          mainText: mainText,
          rating: rating,
          username: username,
          theatreId: theatre,
        },
      }
    );

    return res.status(201).json({
      message: `Review added by ${username}.`,
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

exports.updateReview = async (req, res) => {
  const reviewId = req.params.reviewId;

  const { mainText, rating } = req.body;

  if (!mainText && !rating) {
    throw new BadRequestError("You need to add a mainText and/or a rating!");
  }

  if (!mainText) {
    const [updatedReview, metadata] = await sequelize.query(
      `UPDATE review SET rating = $rating
      WHERE id = $reviewId RETURNING *;`,
      {
        bind: {
          reviewId: reviewId,
          rating: rating,
        },
        type: QueryTypes.UPDATE,
      }
    );
  } else {
    const [updatedReview, metadata] = await sequelize.query(
      `UPDATE review SET mainText = $mainText, rating = $rating
      WHERE id = $reviewId RETURNING *;`,
      {
        bind: {
          reviewId: reviewId,
          mainText: mainText,
          rating: rating,
        },
        type: QueryTypes.UPDATE,
      }
    );
  }

  return res.sendStatus(200).send(updatedReview);
};

exports.deleteReview = async (req, res) => {
  const reviewId = req.params.reviewId;

  const [results, metadata] = await sequelize.query(
    `DELETE FROM review WHERE id = $reviewId RETURNING *`,
    {
      bind: { reviewId },
    }
  );

  return res.sendStatus(200);
};
