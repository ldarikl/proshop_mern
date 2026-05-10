import React, { useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listFeatureFlags } from '../actions/featureFlagActions'

const DashboardFeaturesScreen = ({ history }) => {
  const dispatch = useDispatch()

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

  return (
    <>
      <h1>Dashboard Features</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>NAME</th>
              <th>STATUS</th>
              <th>TRAFFIC %</th>
              <th>LAST MODIFIED</th>
              <th>DEPENDS ON</th>
            </tr>
          </thead>
          <tbody>
            {featureFlags.map((feature) => (
              <tr key={feature.key}>
                <td>
                  <div>{feature.name}</div>
                  <small className='text-muted'>{feature.key}</small>
                </td>
                <td>{feature.status}</td>
                <td>{feature.traffic_percentage}%</td>
                <td>{feature.last_modified}</td>
                <td>
                  {feature.dependencies && feature.dependencies.length > 0
                    ? feature.dependencies.join(', ')
                    : 'None'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default DashboardFeaturesScreen
