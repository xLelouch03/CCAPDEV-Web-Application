import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default:'User'
  },
  avatar: {
    type: String, // You can store the URL of the image
    default: '../../images/default-avatar' // Replace this with the URL of your default avatar image
  },
  profileDescription: {
    type: String,
    default: ""
  },
  establishmentPhotos: {
    type: [String], // Array of strings to store multiple image URLs
    default: []
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Review',
    default: []
  },
  dislikes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Review',
    default: []
  }
});

const User = mongoose.model('User', userSchema);

export default User;