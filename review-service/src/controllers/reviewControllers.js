const Review = require("../models/Review");
const ReviewVote = require("../models/ReviewVote");
const { publishEvent } = require("../events/publisher");
const { ROUTING_KEYS } = require("/app/shared/rabbitmq/events.config.js");

//buat review baru (tanpa gambar)
exports.createReview = async (req, res) => {
  try {
    const userId = req.user.userId; //dari token
    const { recipeId, rating, comment } = req.body;

    const newReview = new Review({
      userId,
      recipeId,
      rating,
      comment,
    });

    await newReview.save();

    //kirim event review.created ke recipe-service
    await publishEvent(ROUTING_KEYS.REVIEW_CREATED, {
      recipeId,
      reviewId: newReview._id,
      rating
    });

    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: "Gagal membuat review", detail: err.message });
  }
};

//hapus review (soft delete)
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    const deleted = await Review.findByIdAndUpdate(reviewId, {
      deletedAt: new Date()
    });

    if (!deleted) {
      return res.status(404).json({ error: "Review tidak ditemukan" });
    }

    //kirim event review.deleted ke recipe-service
    await publishEvent(ROUTING_KEYS.REVIEW_DELETED, {
      recipeId: deleted.recipeId,
      reviewId: deleted._id,
      rating: deleted.rating
    });

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus review", detail: err.message });
  }
};

//ambil semua review untuk satu resep (internal)
exports.getReviewsByRecipeId = async (req, res) => {
  try {
    const reviews = await Review.find({
      recipeId: req.params.recipeId,
      deletedAt: null
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil review", detail: err.message });
  }
};

//ambil semua review milik user (internal)
exports.getReviewsByUserId = async (req, res) => {
  try {
    const reviews = await Review.find({
      userId: req.params.userId,
      deletedAt: null
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil review", detail: err.message });
  }
};

//Upvote review
exports.upvoteReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.userId;

  try {
    const existingVote = await ReviewVote.findOne({ reviewId, userId });

    if (existingVote) {
      existingVote.vote = "upvote";
      await existingVote.save();
      return res.json({ message: "Vote diperbarui jadi upvote" });
    }

    await ReviewVote.create({ reviewId, userId, vote: "upvote" });
    res.status(201).json({ message: "Upvote berhasil" });
  } catch (err) {
    res.status(500).json({ error: "Gagal upvote", detail: err.message });
  }
};

//Downvote review
exports.downvoteReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.userId;

  try {
    const existingVote = await ReviewVote.findOne({ reviewId, userId });

    if (existingVote) {
      existingVote.vote = "downvote";
      await existingVote.save();
      return res.json({ message: "Vote diperbarui jadi downvote" });
    }

    await ReviewVote.create({ reviewId, userId, vote: "downvote" });
    res.status(201).json({ message: "Downvote berhasil" });
  } catch (err) {
    res.status(500).json({ error: "Gagal downvote", detail: err.message });
  }
};

//itung rata-rata rating dan total review untuk satu resep
exports.getRecipeSummary = async (req, res) => {
  try {
    const result = await Review.aggregate([
      { $match: { recipeId: req.params.recipeId, deletedAt: null } },
      {
        $group: {
          _id: "$recipeId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) {
      return res.json({ averageRating: 0, totalReviews: 0 });
    }

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: "Gagal menghitung ringkasan review", detail: err.message });
  }
};