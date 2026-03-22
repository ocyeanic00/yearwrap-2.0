import axios from 'axios'
import Recap from '../models/Recap.js'
import Memory from '../models/Memory.js'

export const generateRecap = async (req, res) => {
  try {
    const { year } = req.body
    const memories = await Memory.find({
      user_id: req.user._id,
      year,
      status: 'active'
    })

    const aiResponse = await axios.post(
      `${process.env.AI_SERVICE_URL}/generate-recap`,
      { memories }
    )

    const recap = await Recap.create({
      user_id: req.user._id,
      year,
      content: aiResponse.data
    })

    res.json(recap)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getRecap = async (req, res) => {
  try {
    const recap = await Recap.findOne({
      user_id: req.user._id,
      year: req.params.year
    })
    if (!recap) return res.status(404).json({ message: 'Recap not found' })
    res.json(recap)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
