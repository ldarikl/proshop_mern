import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import Meta from '../components/Meta'
import { listProducts } from '../actions/productActions'

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword

  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products, page, pages } = productList

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])

  const hasProducts = products && products.length > 0
  const resultLabel = keyword
    ? `Search results for "${keyword}"`
    : 'Latest products'
  const resultSummary = hasProducts
    ? `${products.length} products on page ${page} of ${pages}`
    : 'No products to show'

  return (
    <>
      <Meta />
      <div className='catalog-shell'>
        <aside className='catalog-sidebar'>
          <div className='catalog-panel'>
            <p className='catalog-panel-eyebrow'>Browse</p>
            <h2>Shop by interest</h2>
            <div className='catalog-shortcuts'>
              {['Electronics', 'Audio', 'Cameras', 'Accessories'].map(
                (category) => (
                  <button
                    className='catalog-chip'
                    type='button'
                    disabled
                    key={category}
                  >
                    {category}
                  </button>
                )
              )}
            </div>
          </div>

          <div className='catalog-panel'>
            <p className='catalog-panel-eyebrow'>Refine</p>
            <div className='catalog-filter-row'>
              <span>Rating</span>
              <strong>4 stars and up</strong>
            </div>
            <div className='catalog-filter-row'>
              <span>Availability</span>
              <strong>In stock</strong>
            </div>
          </div>
        </aside>

        <section className='catalog-content'>
          <div className='catalog-toolbar'>
            <div>
              <h1>Catalog</h1>
              <p>{resultLabel}</p>
            </div>
            <div className='catalog-toolbar-actions'>
              {!loading && !error && (
                <span className='catalog-count'>{resultSummary}</span>
              )}
              {keyword && (
                <Link to='/' className='btn btn-light catalog-back'>
                  Go Back
                </Link>
              )}
            </div>
          </div>

          {loading ? (
            <div className='catalog-state'>
              <Loader />
            </div>
          ) : error ? (
            <Message variant='danger'>{error}</Message>
          ) : hasProducts ? (
            <>
              <Row className='catalog-grid'>
                {products.map((product) => (
                  <Col
                    key={product._id}
                    sm={12}
                    md={6}
                    lg={4}
                    xl={3}
                    className='catalog-grid-col'
                  >
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
              <div className='catalog-pagination'>
                <Paginate
                  pages={pages}
                  page={page}
                  keyword={keyword ? keyword : ''}
                />
              </div>
            </>
          ) : (
            <div className='catalog-empty'>
              <h2>{keyword ? 'No matching products' : 'No products yet'}</h2>
              <p>
                {keyword
                  ? `We could not find anything for "${keyword}".`
                  : 'The catalog is empty right now.'}
              </p>
              {keyword && (
                <Link to='/' className='btn btn-primary'>
                  Back to catalog
                </Link>
              )}
            </div>
          )}
        </section>
      </div>
    </>
  )
}

export default HomeScreen
