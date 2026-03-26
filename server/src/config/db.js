import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    // Temporarily disabled - start MongoDB or configure MONGO_URI
    // const conn = await mongoose.connect(process.env.MONGO_URI)
    // console.log(`MongoDB Connected: ${conn.connection.host}`)
    console.log('MongoDB connection disabled - start MongoDB to enable')
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
