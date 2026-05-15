import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render, screen } from '@testing-library/react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardFeaturesScreen from './DashboardFeaturesScreen'

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}))

jest.mock('../actions/featureFlagActions', () => ({
  listFeatureFlags: () => ({ type: 'FEATURE_FLAG_LIST_REQUEST' }),
}))

const renderDashboard = ({
  userInfo = { name: 'Admin User', isAdmin: true },
  featureFlagList = {},
} = {}) => {
  const dispatch = jest.fn()
  const history = { push: jest.fn() }
  const state = {
    userLogin: { userInfo },
    featureFlagList: {
      loading: false,
      featureFlags: [
        {
          key: 'search_v2',
          name: 'New Search Algorithm',
          status: 'Testing',
          traffic_percentage: 25,
          last_modified: '2026-05-10',
        },
        {
          key: 'guest_cart_persistence',
          name: 'Guest Cart Persistence',
          status: 'Enabled',
          traffic_percentage: 100,
          last_modified: '2026-01-15',
        },
        {
          key: 'semantic_search',
          name: 'Semantic Vector Search',
          status: 'Disabled',
          traffic_percentage: 0,
          last_modified: '2026-02-14',
        },
      ],
      ...featureFlagList,
    },
  }

  useDispatch.mockReturnValue(dispatch)
  useSelector.mockImplementation((selector) => selector(state))

  render(<DashboardFeaturesScreen history={history} />)

  return { dispatch, history }
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('redirects non-admin users to login', () => {
  const { history } = renderDashboard({
    userInfo: { name: 'John Doe', isAdmin: false },
  })

  expect(history.push).toHaveBeenCalledWith('/login')
})

test('shows a loading skeleton while feature flags are loading', () => {
  renderDashboard({
    featureFlagList: { loading: true, featureFlags: [] },
  })

  expect(screen.getByText('Loading feature flags...')).toBeInTheDocument()
  expect(screen.getAllByLabelText('Loading feature flag row')).toHaveLength(3)
})

test('shows an error state when feature flags fail to load', () => {
  renderDashboard({
    featureFlagList: {
      loading: false,
      error: 'Unable to load feature flags',
      featureFlags: [],
    },
  })

  expect(screen.getByRole('alert')).toHaveTextContent(
    'Unable to load feature flags'
  )
})

test('filters feature flags by search text and status', () => {
  renderDashboard()

  fireEvent.change(screen.getByLabelText('Search feature flags by name'), {
    target: { value: 'search' },
  })
  fireEvent.change(screen.getByLabelText('Filter feature flags by status'), {
    target: { value: 'Disabled' },
  })

  expect(screen.getByText('Semantic Vector Search')).toBeInTheDocument()
  expect(screen.queryByText('New Search Algorithm')).not.toBeInTheDocument()
  expect(screen.queryByText('Guest Cart Persistence')).not.toBeInTheDocument()
})

test('shows an empty state when filters match no feature flags', () => {
  renderDashboard()

  fireEvent.change(screen.getByLabelText('Search feature flags by name'), {
    target: { value: 'does not exist' },
  })

  expect(screen.getByText('No feature flags found')).toBeInTheDocument()
})

test('updates status badge and traffic percentage on UI controls', () => {
  renderDashboard()

  expect(screen.getByTestId('status-badge-search_v2')).toHaveTextContent(
    'Testing'
  )

  fireEvent.click(screen.getByLabelText('Toggle New Search Algorithm'))

  expect(screen.getByTestId('status-badge-search_v2')).toHaveTextContent(
    'Enabled'
  )

  fireEvent.change(
    screen.getByLabelText('Set traffic percentage for New Search Algorithm'),
    {
      target: { value: '80' },
    }
  )

  expect(screen.getByTestId('traffic-value-search_v2')).toHaveTextContent('80%')
})
