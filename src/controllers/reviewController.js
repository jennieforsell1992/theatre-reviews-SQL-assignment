const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { UnauthorizedError, BadRequestError } = require("../utils/errors");
const jwt = require("jsonwebtoken");
const { userRoles } = require("../constants/users");

exports.getAllReviewsFromTheatre = async (req, res) => {
  const theatreId = req.params.theatreId;

  const [reviews, metadata] = await sequelize.query(
    "SELECT * FROM review WHERE fk_theatre_id = $theatreId LIMIT 5;",
    {
      bind: { theatreId },
    }
  );

  return res.send(reviews);
};

exports.getReviewById = async (req, res) => {
  const theatreId = req.params.theatreId;
  const reviewId = req.params.reviewId;

  const [review, metadata] = await sequelize.query(
    "SELECT * FROM review WHERE fk_theatre_id = $theatreId AND id = $reviewId",
    {
      bind: { theatreId, reviewId },
    }
  );

  return res.send(review);
};

exports.createReview = async (req, res) => {
  const { mainText, rating } = req.body;
  const theatre = req.params.theatreId;

  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const userId = payload.userId;
  const username = payload.username;

  if (!mainText || !rating) {
    throw new BadRequestError(
      "You have to provide a text and a rating for your review!"
    );
  }

  if (rating < 1 || rating > 5) {
    throw new BadRequestError("You have to rate the theatre between 1 and 5");
  }

  await sequelize.query(
    `INSERT INTO review (mainText, rating, fk_user_id, fk_theatre_id)
      VALUES
      ($mainText, $rating, (SELECT id FROM user WHERE id = $userId), 
      (SELECT id FROM theatre WHERE id = $theatreId));`,
    {
      bind: {
        mainText: mainText,
        rating: rating,
        userId: userId,
        theatreId: theatre,
      },
    }
  );

  return res.status(201).json({
    message: `Review added by ${username}.`,
  });
};

exports.updateReview = async (req, res) => {
  const reviewId = req.params.reviewId;

  const { mainText, rating } = req.body;

  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const userId = payload.userId;
  const role = payload.role;

  if (!mainText && !rating) {
    throw new BadRequestError("You need to add a mainText and/or a rating!");
  }

  const [reviewMatch, metadata] = await sequelize.query(
    `SELECT fk_user_id FROM review WHERE Id = $reviewId;`,
    {
      bind: {
        reviewId: reviewId,
      },
      type: QueryTypes.SELECT,
    }
  );

  if (reviewMatch === undefined) {
    throw new UnauthorizedError("You can only update your own reviews!");
  }

  if (role === userRoles.ADMIN) {
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
    return res.sendStatus(200).send(updatedReview);
  } else {
    if (reviewMatch.fk_user_id !== userId) {
      throw new UnauthorizedError("You can only update your own reviews");
    }
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
    return res.sendStatus(200).send(updatedReview);
  }
};

exports.deleteReview = async (req, res) => {
  const reviewId = req.params.reviewId;

  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const userId = payload.userId;
  const role = payload.role;

  const [reviewMatch] = await sequelize.query(
    `SELECT fk_user_id FROM review WHERE Id = $reviewId;`,
    {
      bind: {
        reviewId: reviewId,
      },
      type: QueryTypes.SELECT,
    }
  );

  if (reviewMatch === undefined) {
    throw new UnauthorizedError("You can only delete your own reviews!");
  }

  if (role === userRoles.ADMIN) {
    const [results, metadata] = await sequelize.query(
      `DELETE FROM review WHERE id = $reviewId RETURNING *`,
      {
        bind: { reviewId },
      }
    );
  } else {
    if (reviewMatch.fk_user_id !== userId) {
      throw new UnauthorizedError("You can only update your own reviews");
    }

    const [results, metadata] = await sequelize.query(
      `DELETE FROM review WHERE id = $reviewId RETURNING *`,
      {
        bind: { reviewId },
      }
    );
  }

  return res.sendStatus(200);
};
