import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const url = 'http://localhost:3000';

  useEffect(() => {
    // Fetch all products
    axios.get(url+'/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleAddToCart = (productId) => {
    // Add product to cart
    axios.post(`${url}/cart/${userId}`, { productId })
      .then(response => {
        console.log('Item added to cart:', response.data);
        // Refresh cart items
        fetchCartItems();
      })
      .catch(error => {
        console.error('Error adding item to cart:', error);
      });
  };

  const fetchCartItems = () => {
    // Fetch cart items for the user
    axios.get(`${url}/cart/${userId}`)
      .then(response => {
        setCartItems(response.data);
      })
      .catch(error => {
        console.error('Error fetching cart items:', error);
      });
  };

  return (
    <div className="container mt-5">
      <h1>Product List</h1>
      <ul className="list-group">
        {products.map(product => (
          <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5>{product.name}</h5>
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
              <p>Stock Status: {product.stockStatus}</p>
            </div>
            <button onClick={() => handleAddToCart(product.id)} className="btn btn-primary">Add to Cart</button>
          </li>
        ))}
      </ul>

      <div className="mt-5">
        <h2>Shopping Cart</h2>
        <input type="text" placeholder="Enter User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <button onClick={fetchCartItems} className="btn btn-primary">Fetch Cart Items</button>
        <ul className="list-group mt-3">
          {cartItems.map(item => (
            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
              <p>Product ID: {item.productId}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
