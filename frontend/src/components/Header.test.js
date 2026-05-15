import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import Header from './Header'

const renderHeader = (state) => {
  const store = {
    getState: () => state,
    subscribe: () => {},
    dispatch: jest.fn(),
  }

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </Provider>
  )
}

test('keeps the feature dashboard link inside the admin dropdown', () => {
  renderHeader({
    userLogin: { userInfo: { name: 'Admin User', isAdmin: true } },
  })

  fireEvent.click(screen.getByText('Admin'))

  expect(screen.getByText('Feature Dashboard')).toBeInTheDocument()
  expect(screen.getByText('Feature Dashboard').closest('a')).toHaveAttribute(
    'href',
    '/admin/featuredashboard'
  )
})
