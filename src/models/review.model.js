import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  establishment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Establishment',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  images: [{
    type: String
  }],
  datePosted: {
    type: Date,
    default: Date.now,
  },
  lastEdited: {
    type: Date,
  },
  helpfulFeedback: {
    type: Number,
    default: 0,
  },
  unhelpfulFeedback: {
    type: Number,
    default: 0,
  },
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;