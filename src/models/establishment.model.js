import mongoose from 'mongoose';

const establishmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
  }],
});

const Establishment = mongoose.model('Establishment', establishmentSchema);

export default Establishment;