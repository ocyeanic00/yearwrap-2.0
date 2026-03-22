import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { generateRecap, getRecap } from '../controllers/recapController.js'

const router = express.Router()

router.use(protect)

router.post('/generate', generateRecap)
router.get('/:year', getRecap)

export default router
