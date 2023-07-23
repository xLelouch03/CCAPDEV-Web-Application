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
  avatar: {
    type: String, // You can store the URL of the image
    default: 'default-avatar-url' // Replace this with the URL of your default avatar image
  },
  profileDescription: {
    type: String,
    default: '',
  }
});

const User = mongoose.model('User', userSchema);

export default User;