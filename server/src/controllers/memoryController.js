import Memory from '../models/Memory.js'

export const getMemories = async (req, res) => {
  try {
    const { status } = req.query
    const query = { user_id: req.user._id }
    if (status) query.status = status

    const memories = await Memory.find(query).sort({ createdAt: -1 })
    res.json(memories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createMemory = async (req, res) => {
  try {
    const memory = await Memory.create({
      ...req.body,
      user_id: req.user._id
    })
    res.status(201).json(memory)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateMemory = async (req, res) => {
  try {
    const memory = await Memory.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      req.body,
      { new: true }
    )
    if (!memory) return res.status(404).json({ message: 'Memory not found' })
    res.json(memory)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteMemory = async (req, res) => {
  try {
    const memory = await Memory.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      { status: 'deleted' },
      { new: true }
    )
    if (!memory) return res.status(404).json({ message: 'Memory not found' })
    res.json(memory)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
