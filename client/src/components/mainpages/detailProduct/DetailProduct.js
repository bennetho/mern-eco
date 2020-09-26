import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import ProductItem from "../../utils/product_Item/ProductItem";

function DetailProduct() {
  const params = useParams();
  const state = useContext(GlobalState);
  const [products] = state.productsAPI.products;
  const [detailProduct, setDetailProduct] = useState([]);

  const addCart = state.userAPI.addCart;

  useEffect(() => {
    if (params.id) {
      products.forEach((product) => {
        if (product._id === params.id) setDetailProduct(product);
        //detailProduct can now use product cos of dis setDetailProduct(product)
      });
    }
  }, [params.id, products]);

  if (detailProduct.length === 0) return null;

  const {
    images,
    title,
    description,
    content,
    sold,
    price,
    product_id,
  } = detailProduct; //destructuring
  return (
    <>
      <div className='detail'>
        <img src={images} alt='' />
        <div className='box-detail'>
          <div className='row'>
            <h2>{title}</h2>
            <h6>#:id {product_id}</h6>
          </div>
          <span>£{price}</span>
          <p>{description}</p>
          <p>{content}</p>
          <p> sold: {sold}</p>
          <Link
            to='/cart'
            className='cart'
            onClick={() => addCart(detailProduct)}
          >
            Buy Now
          </Link>
        </div>
      </div>

      <div>
        <h2>Related products</h2>
        <div className='products'>
          {products.map((product) => {
            return product.category === detailProduct.category ? (
              <ProductItem key={product._id} product={product} />
            ) : null;
          })}
        </div>
      </div>
    </>
  );
}

export default DetailProduct;
