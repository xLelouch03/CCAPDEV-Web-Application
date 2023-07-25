import mongoose from 'mongoose';

const establishmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: 'static/images/default-avatar.jpg"'
  },
  images: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    rquired: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  rating: {
    type: mongoose.Schema.Types.Decimal128
  }
});

establishmentSchema.index({ name: 'text'});

const Establishment = mongoose.model('Establishment', establishmentSchema);

export default Establishment;