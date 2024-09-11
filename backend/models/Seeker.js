import mongoose from 'mongoose';

const SeekerSchema = new mongoose.Schema({
  tokenID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
});

const Seeker = mongoose.model('Seeks', SeekerSchema);

export default Seeker;