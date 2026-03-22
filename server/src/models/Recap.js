import mongoose from 'mongoose'

const recapSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  content: {
    type: Object,
    required: true
  },
  generated_at: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

export default mongoose.model('Recap', recapSchema)
