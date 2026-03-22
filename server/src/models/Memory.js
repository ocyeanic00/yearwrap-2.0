import mongoose from 'mongoose'

const memorySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  photos: [String],
  notes: {
    best_memory: String,
    lesson: String,
    people: String,
    place: String,
    quote: String,
    gratitude: String
  },
  status: {
    type: String,
    enum: ['active', 'deleted'],
    default: 'active'
  }
}, { timestamps: true })

export default mongoose.model('Memory', memorySchema)
