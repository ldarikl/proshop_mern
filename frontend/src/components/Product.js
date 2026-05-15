import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import Rating from './Rating'

const Product = ({ product }) => {
  return (
    <Card className='product-card'>
      <Link to={`/product/${product._id}`} className='product-card-image'>
        <Card.Img src={product.image} variant='top' alt={product.name} />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`} className='product-card-title'>
          <Card.Title as='div'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div' className='product-card-rating'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as='h3' className='product-card-price'>
          ${product.price}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
