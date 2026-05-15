import React, { useEffect, useMemo, useState } from 'react'
import { Badge, Button, Col, Form, Row, Table } from 'react-bootstrap'
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
  <div aria-live='polite'>
    <p className='text-muted mb-3'>Loading feature flags...</p>
    {[0, 1, 2].map((row) => (
      <div
        key={row}
        aria-label='Loading feature flag row'
        className='mb-3 p-3 border rounded'
      >
        <div className='bg-light mb-2' style={{ height: '18px', width: '35%' }} />
        <div className='bg-light mb-2' style={{ height: '14px', width: '60%' }} />
        <div className='bg-light' style={{ height: '14px', width: '25%' }} />
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
    <>
      <h1>Feature Dashboard</h1>
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Row className='align-items-end mb-3'>
            <Col md={8}>
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
            </Col>
            <Col md={4}>
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
            </Col>
          </Row>

          {visibleFeatureFlags.length === 0 ? (
            <Message variant='info'>No feature flags found</Message>
          ) : (
            <Table striped bordered hover responsive className='table-sm'>
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>STATUS</th>
                  <th>TRAFFIC %</th>
                  <th>LAST MODIFIED</th>
                  <th>CONTROLS</th>
                </tr>
              </thead>
              <tbody>
                {visibleFeatureFlags.map((feature) => (
                  <tr key={feature.key}>
                    <td>
                      <div>{feature.name}</div>
                      <small className='text-muted'>{feature.key}</small>
                    </td>
                    <td>
                      <Badge
                        variant={getBadgeVariant(feature.status)}
                        data-testid={`status-badge-${feature.key}`}
                      >
                        {feature.status}
                      </Badge>
                    </td>
                    <td data-testid={`traffic-value-${feature.key}`}>
                      {feature.traffic_percentage}%
                    </td>
                    <td>{feature.last_modified}</td>
                    <td>
                      <Button
                        type='button'
                        variant='outline-primary'
                        size='sm'
                        className='mr-3 mb-2'
                        aria-label={`Toggle ${feature.name}`}
                        onClick={() => toggleFeature(feature.key)}
                      >
                        {feature.status === 'Enabled' ? 'Disable' : 'Enable'}
                      </Button>
                      <Form.Control
                        type='range'
                        min='0'
                        max='100'
                        value={feature.traffic_percentage}
                        aria-label={`Set traffic percentage for ${feature.name}`}
                        onChange={(event) =>
                          updateTrafficPercentage(feature.key, event.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}
    </>
  )
}

export default DashboardFeaturesScreen
