import React, { useEffect, useMemo, useState } from 'react'
import { Badge, Button, Form, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import { listFeatureFlags } from '../actions/featureFlagActions'

const getBadgeVariant = (status) => {
  if (status === 'Enabled') {
    return 'success'
  }

  if (status === 'Testing') {
    return 'primary'
  }

  return 'secondary'
}

const LoadingSkeleton = () => (
  <div className='feature-dashboard-skeleton' aria-live='polite'>
    <p>Loading feature flags...</p>
    {[0, 1, 2].map((row) => (
      <div
        key={row}
        aria-label='Loading feature flag row'
        className='feature-dashboard-skeleton-row'
      >
        <div className='feature-dashboard-skeleton-line feature-dashboard-skeleton-line-title' />
        <div className='feature-dashboard-skeleton-line feature-dashboard-skeleton-line-body' />
        <div className='feature-dashboard-skeleton-line feature-dashboard-skeleton-line-meta' />
      </div>
    ))}
  </div>
)

const DashboardFeaturesScreen = ({ history }) => {
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [editableFeatureFlags, setEditableFeatureFlags] = useState([])

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const featureFlagList = useSelector((state) => state.featureFlagList)
  const { loading, error, featureFlags } = featureFlagList

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listFeatureFlags())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo])

  useEffect(() => {
    setEditableFeatureFlags(featureFlags || [])
  }, [featureFlags])

  const visibleFeatureFlags = useMemo(
    () =>
      editableFeatureFlags.filter((feature) => {
        const matchesSearch = feature.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
        const matchesStatus =
          statusFilter === 'All' || feature.status === statusFilter

        return matchesSearch && matchesStatus
      }),
    [editableFeatureFlags, searchTerm, statusFilter]
  )

  const statusCounts = useMemo(
    () =>
      editableFeatureFlags.reduce(
        (counts, feature) => ({
          ...counts,
          [feature.status]: (counts[feature.status] || 0) + 1,
        }),
        { Enabled: 0, Testing: 0, Disabled: 0 }
      ),
    [editableFeatureFlags]
  )

  const toggleFeature = (featureKey) => {
    setEditableFeatureFlags((currentFeatureFlags) =>
      currentFeatureFlags.map((feature) =>
        feature.key === featureKey
          ? {
              ...feature,
              status: feature.status === 'Enabled' ? 'Disabled' : 'Enabled',
            }
          : feature
      )
    )
  }

  const updateTrafficPercentage = (featureKey, value) => {
    setEditableFeatureFlags((currentFeatureFlags) =>
      currentFeatureFlags.map((feature) =>
        feature.key === featureKey
          ? { ...feature, traffic_percentage: Number(value) }
          : feature
      )
    )
  }

  return (
    <section className='feature-dashboard'>
      <div className='feature-dashboard-header'>
        <div>
          <p className='feature-dashboard-eyebrow'>Admin controls</p>
          <h1>Feature Dashboard</h1>
          <p>
            Review rollout status, filter feature flags, and adjust test
            traffic.
          </p>
        </div>
      </div>
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <div className='feature-dashboard-summary'>
            <div
              className='feature-dashboard-stat'
              aria-label='Enabled features count'
            >
              <span>{statusCounts.Enabled}</span>
              <strong>Enabled</strong>
            </div>
            <div
              className='feature-dashboard-stat'
              aria-label='Testing features count'
            >
              <span>{statusCounts.Testing}</span>
              <strong>Testing</strong>
            </div>
            <div
              className='feature-dashboard-stat'
              aria-label='Disabled features count'
            >
              <span>{statusCounts.Disabled}</span>
              <strong>Disabled</strong>
            </div>
          </div>

          <div className='feature-dashboard-toolbar'>
            <Form.Group controlId='featureSearch'>
              <Form.Label>Search by feature name</Form.Label>
              <Form.Control
                aria-label='Search feature flags by name'
                type='text'
                placeholder='Search features...'
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId='featureStatusFilter'>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as='select'
                aria-label='Filter feature flags by status'
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value='All'>All</option>
                <option value='Enabled'>Enabled</option>
                <option value='Testing'>Testing</option>
                <option value='Disabled'>Disabled</option>
              </Form.Control>
            </Form.Group>
          </div>

          {visibleFeatureFlags.length === 0 ? (
            <div className='feature-dashboard-empty'>
              <h2>No feature flags found</h2>
              <p>Adjust the search or status filter to show more results.</p>
            </div>
          ) : (
            <div className='feature-dashboard-table'>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Status</th>
                    <th>Traffic</th>
                    <th>Last modified</th>
                    <th>Controls</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleFeatureFlags.map((feature) => (
                    <tr key={feature.key}>
                      <td>
                        <div className='feature-dashboard-name'>
                          {feature.name}
                        </div>
                        <small>{feature.key}</small>
                      </td>
                      <td>
                        <Badge
                          className={`feature-dashboard-badge feature-dashboard-badge-${feature.status.toLowerCase()}`}
                          variant={getBadgeVariant(feature.status)}
                          data-testid={`status-badge-${feature.key}`}
                        >
                          {feature.status}
                        </Badge>
                      </td>
                      <td
                        className='feature-dashboard-traffic'
                        data-testid={`traffic-value-${feature.key}`}
                      >
                        {feature.traffic_percentage}%
                      </td>
                      <td>{feature.last_modified}</td>
                      <td>
                        <div className='feature-dashboard-controls'>
                          <Button
                            type='button'
                            variant='outline-primary'
                            size='sm'
                            aria-label={`Toggle ${feature.name}`}
                            onClick={() => toggleFeature(feature.key)}
                          >
                            {feature.status === 'Enabled'
                              ? 'Disable'
                              : 'Enable'}
                          </Button>
                          <Form.Control
                            type='range'
                            min='0'
                            max='100'
                            value={feature.traffic_percentage}
                            aria-label={`Set traffic percentage for ${feature.name}`}
                            onChange={(event) =>
                              updateTrafficPercentage(
                                feature.key,
                                event.target.value
                              )
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default DashboardFeaturesScreen
