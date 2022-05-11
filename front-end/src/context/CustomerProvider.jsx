import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerContext from './CustomerContext';

function CustomerProvider({ children }) {
  const [totalPrice, setTotalPrice] = useState('0.00');
  const loadCart = () => {
    if (localStorage.getItem('cart') !== null) {
      return JSON.parse(localStorage.getItem('cart'));
    }
    return [];
  };
  const [cart, setCart] = useState(loadCart());
  const [saleInfo, setSaleInfo] = useState({});
  const API = axios.create({
    baseURL: 'http://localhost:3001',
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    setTotalPrice(cart.reduce((acc, { quantity, price }) => (
      acc + (quantity * Number(price))
    ), 0));
  }, [cart]);

  const checkout = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const result = await API.get(
        '/customer/checkout',
        { cart, saleInfo },
        {
          headers: {
            Authorization: currentUser.token,
          },
        },
      );
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  const context = {
    totalPrice,
    cart,
    setCart,
    checkout,
    setSaleInfo,
  };

  return (
    <CustomerContext.Provider value={ context }>
      {children}
    </CustomerContext.Provider>
  );
}

CustomerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CustomerProvider;
