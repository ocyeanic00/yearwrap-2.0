import User from '../models/User.js'
import { generateToken } from '../utils/generateToken.js'

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body
    
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const user = await User.create({ email, password, name })
    const token = generateToken(user._id)

    res.status(201).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      token
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = generateToken(user._id)

    res.json({
      _id: user._id,
      email: user.email,
      name: user.name,
      token
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
