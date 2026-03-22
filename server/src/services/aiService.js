import axios from 'axios'

export const generateRecapFromAI = async (memories) => {
  try {
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/generate-recap`,
      { memories }
    )
    return response.data
  } catch (error) {
    throw new Error('AI service failed')
  }
}
