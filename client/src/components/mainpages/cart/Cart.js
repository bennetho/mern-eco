import React, { useContext, useState, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";

import PaypalButton from "./PaypalButton";

function Cart() {
  const state = useContext(GlobalState);
  const [cart, setCart] = state.userAPI.cart;
  const [token] = state.token;
  const [callback, setCallback] = state.userAPI.callback;
  const [total, setTotal] = useState(0);

  const addCart = async (cart) => {
    await axios.patch(
      "/user/addcart",
      { cart },
      {
        headers: { Authorization: token },
      }
    );
  };

  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce((previousValue, item) => {
        return previousValue + item.price * item.quantity;
      }, 0);

      setTotal(total);
    };

    getTotal();
  }, [cart]);

  //increment
  const increment = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity += 1;
      }
    });

    setCart([...cart]);
    addCart(cart);
  };
  //decrement
  const decrement = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
      }
    });

    setCart([...cart]);
    addCart(cart);
  };

  const removeProduct = (id) => {
    if (window.confirm("Do you want to remove product?")) {
      cart.forEach((item, index) => {
        if (item._id === id) {
          cart.splice(index, 1);
        }
      });
      setCart([...cart]);
      addCart(cart);
    }
  };

  const tranSuccess = async (payment) => {
    const { paymentID, address } = payment;

    await axios.post(
      "/api/payment",
      { cart, paymentID, address },
      {
        headers: { Authorization: token },
      }
    );

    setCart([]);
    addCart([]);
    alert("You have successfully placed an order.");
    setCallback(!callback);
  };

  if (cart.length === 0)
    return (
      <h2 style={{ textAlign: "center", fontSize: "5rem" }}>Cart Empty</h2>
    );

  return (
    <div>
      {cart.map((product) => (
        <div className='detail cart' key={product._id}>
          <img src={product.images} alt='' className='img-container' />

          <div className='box-detail'>
            <h2>{product.title}</h2>

            <h3>£{product.price * product.quantity}</h3>
            <p>{product.description}</p>
            <p>{product.content}</p>

            <div className='amount'>
              <button onClick={() => decrement(product._id)}> - </button>
              <span>{product.quantity}</span>
              <button onClick={() => increment(product._id)}> + </button>
            </div>
            <div className='delete' onClick={() => removeProduct(product._id)}>
              x
            </div>
          </div>
        </div>
      ))}

      <div className='total'>
        <h3>Total: £ {total}</h3>
        <PaypalButton total={total} tranSuccess={tranSuccess} />
      </div>
    </div>
  );
}

export default Cart;
