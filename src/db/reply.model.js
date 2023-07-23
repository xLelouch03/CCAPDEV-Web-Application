import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
    required: true,
  },
  establishment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Establishment',
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  datePosted: {
    type: Date,
    default: Date.now,
  },
  lastEdited: {
    type: Date,
  }
});

const Reply = mongoose.model('Reply', replySchema);

export default Reply;