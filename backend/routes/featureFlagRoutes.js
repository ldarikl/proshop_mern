import express from 'express'
const router = express.Router()
import { getFeatureFlags } from '../controllers/featureFlagController.js'

router.route('/').get(getFeatureFlags)

export default router
