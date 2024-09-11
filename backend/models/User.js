import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  tokenId: { type: String, required: true, unique: true },
  companyName: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

export default User;