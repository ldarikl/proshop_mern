import asyncHandler from 'express-async-handler'
import { readFeatureFlags } from '../utils/featureFlags.js'

const getFeatureFlags = asyncHandler(async (req, res) => {
  const featureFlags = await readFeatureFlags()
  res.json(featureFlags)
})

export { getFeatureFlags }
