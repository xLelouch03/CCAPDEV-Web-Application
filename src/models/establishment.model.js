import mongoose from 'mongoose';

const establishmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: '../../images/default-avatar'
  },
  images: [{
    type: String,
  }],
  category: {
    type: String,
    required: true
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

const Establishment = mongoose.model('Establishment', establishmentSchema);

export default Establishment;