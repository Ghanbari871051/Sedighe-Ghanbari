import React from 'react';

const Cart = ({ cartItems }) => {
  return (
    <div className="cart">
      <h2>Cart</h2>
      <p>Items in Cart: {cartItems?.length }</p>
    </div>
  );
};

export default Cart;