import test from 'node:test'
import assert from 'node:assert/strict'
import { calcPrices } from './calcPrices.js'

test('calcPrices rejects empty order items', () => {
  assert.throws(() => calcPrices([]), /No order items/)
})

test('calcPrices computes totals from order item prices', () => {
  const prices = calcPrices([
    { price: 30, qty: 2 },
    { price: 50, qty: 1 },
  ])

  assert.deepEqual(prices, {
    itemsPrice: '110.00',
    shippingPrice: '0.00',
    taxPrice: '16.50',
    totalPrice: '126.50',
  })
})
