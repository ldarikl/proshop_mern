import {
  FEATURE_FLAG_LIST_FAIL,
  FEATURE_FLAG_LIST_REQUEST,
  FEATURE_FLAG_LIST_SUCCESS,
} from '../constants/featureFlagConstants'

export const featureFlagListReducer = (state = { featureFlags: [] }, action) => {
  switch (action.type) {
    case FEATURE_FLAG_LIST_REQUEST:
      return { loading: true, featureFlags: [] }
    case FEATURE_FLAG_LIST_SUCCESS:
      return { loading: false, featureFlags: action.payload }
    case FEATURE_FLAG_LIST_FAIL:
      return { loading: false, error: action.payload, featureFlags: [] }
    default:
      return state
  }
}
