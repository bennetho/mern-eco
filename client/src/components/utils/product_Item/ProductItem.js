import React from "react";
import BtnRender from "./BtnRender";

function ProductItem({
  product,
  images,
  title,
  price,
  description,
  _id,
  checked,
  isAdmin,
}) {
  return (
    <div className='product_card'>
      {isAdmin && <input type='checkbox' checked={product.checked} />}

      <img src={product.images} alt='' />
      <div className='product_box'>
        <h2 className='title'>{product.title}</h2>
        <span>£{product.price}</span>
        <p>£{product.description}</p>
      </div>

      <BtnRender product={product} />
    </div>
  );
}

export default ProductItem;
