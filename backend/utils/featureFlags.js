import path from 'path'
import { promises as fs } from 'fs'

const FEATURES_PATH = path.resolve('backend', 'features.json')
const VALID_STATES = ['Disabled', 'Testing', 'Enabled']

class FeatureFlagsError extends Error {
  constructor(code, message, featureId) {
    super(message)
    this.code = code
    this.featureId = featureId
  }
}

const getToday = () => new Date().toISOString().slice(0, 10)

const readFeatureFlags = async () => {
  let featuresFile

  try {
    featuresFile = await fs.readFile(FEATURES_PATH, 'utf8')
  } catch (error) {
    throw new FeatureFlagsError(
      'FILE_READ_ERROR',
      `Unable to read feature flags from '${FEATURES_PATH}'.`
    )
  }

  try {
    return JSON.parse(featuresFile)
  } catch (error) {
    throw new FeatureFlagsError(
      'JSON_PARSE_ERROR',
      `Feature flags file '${FEATURES_PATH}' contains invalid JSON.`
    )
  }
}

const writeFeatureFlags = async (features) => {
  const tempPath = `${FEATURES_PATH}.tmp`
  const payload = `${JSON.stringify(features, null, 2)}\n`

  try {
    await fs.writeFile(tempPath, payload, 'utf8')
    await fs.rename(tempPath, FEATURES_PATH)
  } catch (error) {
    throw new FeatureFlagsError(
      'FILE_WRITE_ERROR',
      `Unable to write feature flags to '${FEATURES_PATH}'.`
    )
  }
}

const getFeatureOrThrow = (features, featureId) => {
  const feature = features[featureId]

  if (!feature) {
    throw new FeatureFlagsError(
      'FEATURE_NOT_FOUND',
      `No feature with ID '${featureId}' exists in features.json.`,
      featureId
    )
  }

  return feature
}

const getDependencyWarnings = (features, featureId, feature) => {
  const dependencies = feature.dependencies || []

  return dependencies.flatMap((dependencyId) => {
    const dependency = features[dependencyId]

    if (!dependency) {
      return [
        `Dependency '${dependencyId}' referenced by '${featureId}' was not found in features.json.`
      ]
    }

    if (dependency.status === 'Enabled') {
      return []
    }

    return [
      `Dependency '${dependencyId}' is in status '${dependency.status}', not 'Enabled'. ${featureId} may not function correctly.`
    ]
  })
}

const formatFeatureResponse = (featureId, feature, extras = {}) => ({
  feature_id: featureId,
  ...feature,
  ...extras
})

const listFeatures = async () => {
  const features = await readFeatureFlags()

  return Object.entries(features).map(([featureId, feature]) => ({
    feature_id: featureId,
    name: feature.name,
    status: feature.status,
    traffic_percentage: feature.traffic_percentage,
    last_modified: feature.last_modified,
    dependencies: feature.dependencies || []
  }))
}

const getFeatureInfo = async (featureId) => {
  const features = await readFeatureFlags()
  const feature = getFeatureOrThrow(features, featureId)

  return formatFeatureResponse(featureId, feature)
}

const setFeatureState = async (featureId, state) => {
  if (!VALID_STATES.includes(state)) {
    throw new FeatureFlagsError(
      'INVALID_STATE',
      `State '${state}' is not valid. Must be one of: Disabled, Testing, Enabled (case-sensitive).`,
      featureId
    )
  }

  const features = await readFeatureFlags()
  const feature = getFeatureOrThrow(features, featureId)

  if (state === 'Enabled') {
    const blockedDependency = (feature.dependencies || []).find((dependencyId) => {
      const dependency = features[dependencyId]
      return dependency && dependency.status === 'Disabled'
    })

    if (blockedDependency) {
      throw new FeatureFlagsError(
        'DEPENDENCY_DISABLED',
        `Feature '${featureId}' cannot be set to 'Enabled' while dependency '${blockedDependency}' is 'Disabled'.`,
        featureId
      )
    }
  }

  feature.status = state

  if (state === 'Disabled') {
    feature.traffic_percentage = 0
  }

  if (state === 'Enabled') {
    feature.traffic_percentage = 100
  }

  if (
    state === 'Testing' &&
    (feature.traffic_percentage < 1 || feature.traffic_percentage > 99)
  ) {
    feature.traffic_percentage = 10
  }

  feature.last_modified = getToday()

  await writeFeatureFlags(features)

  const warnings =
    state === 'Testing' || state === 'Enabled'
      ? getDependencyWarnings(features, featureId, feature)
      : []

  return formatFeatureResponse(featureId, feature, { warnings })
}

const adjustTrafficRollout = async (featureId, percentage) => {
  if (!Number.isInteger(percentage) || percentage < 0 || percentage > 100) {
    throw new FeatureFlagsError(
      'INVALID_PERCENTAGE',
      `Percentage '${percentage}' is not valid. Must be an integer from 0 to 100.`,
      featureId
    )
  }

  const features = await readFeatureFlags()
  const feature = getFeatureOrThrow(features, featureId)

  if (feature.status === 'Disabled' && percentage > 0) {
    throw new FeatureFlagsError(
      'DISABLED_FEATURE_TRAFFIC',
      `Feature '${featureId}' is 'Disabled' and cannot receive traffic above 0.`,
      featureId
    )
  }

  if (feature.status !== 'Testing') {
    throw new FeatureFlagsError(
      'WRONG_STATUS_FOR_ROLLOUT',
      `adjust_traffic_rollout can only be called on features with status 'Testing'. '${featureId}' is currently '${feature.status}'. Use set_feature_state to change its status first.`,
      featureId
    )
  }

  feature.traffic_percentage = percentage
  feature.last_modified = getToday()

  await writeFeatureFlags(features)

  let hint = null

  if (percentage === 0) {
    hint = `Traffic is 0 for '${featureId}'. Consider using set_feature_state with 'Disabled' if rollout is fully stopped.`
  }

  if (percentage === 100) {
    hint = `Traffic is 100 for '${featureId}'. Consider using set_feature_state with 'Enabled' if rollout is complete.`
  }

  return formatFeatureResponse(featureId, feature, { hint })
}

const toErrorResponse = (error, featureId) => ({
  error: error.code || 'UNKNOWN_ERROR',
  message: error.message || 'Unexpected feature flag error.',
  ...(featureId || error.featureId ? { feature_id: featureId || error.featureId } : {})
})

export {
  FeatureFlagsError,
  FEATURES_PATH,
  adjustTrafficRollout,
  getFeatureInfo,
  listFeatures,
  readFeatureFlags,
  setFeatureState,
  toErrorResponse
}
