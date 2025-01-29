import React, { useEffect, useState } from "react";
import "./cartPage.css";
import { BsFillCartFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [x,setX] = useState(false);

  useEffect(() => {
    const fetchCartAndProducts = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (!email) {
          setError("User is not logged in. Please log in to view your cart.");
          setIsLoading(false);
          navigate("/signin");
        }

        // Fetch cart data
        const cartResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/cart?email=${email}`);
        const cartData = await cartResponse.json();
        setCart(cartData.cart || {});

        // Fetch product details for the cart items
        const productIds = Object.keys(cartData.cart || {});
        if (productIds.length > 0) {
          const productsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getProductsByIds`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productIds }),
          });
          const productsData = await productsResponse.json();
          setProducts(productsData);
        }

        // Fetch delivery addresses
        const addressesResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/addresses?email=${email}`);
        const addressesData = await addressesResponse.json();
        let x = JSON.parse(addressesData.delivery_address||[]);
        setAddresses(x || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Unable to fetch cart or address details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartAndProducts();
  }, [x]);

  const handleQuantityChange = async (productId, delta) => {
    const currentQuantity = cart[productId] || 0;
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 0) return;

    const updatedCart = {
      ...cart,
      [productId]: newQuantity === 0 ? undefined : newQuantity,
    };

    try {
      const email = localStorage.getItem("userEmail");
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/cart/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, cart: updatedCart }),
      });
      if (!response.ok) throw new Error("Failed to update cart.");
      setCart(updatedCart);
    } catch (err) {
      console.error("Error updating cart:", err);
      setError("Failed to update item quantity. Please try again.");
    }
    setX(!x);
  };

  const handleAddressDelete = async (addressToDelete,delta) => {
    if (delta<0) {
      var newAddressJson = addresses.filter((addr) => addr !== addressToDelete);
      var newAddressString = JSON.stringify(newAddressJson);
    }
    else{
      var newAddressJson = [...addresses, newAddress];
      var newAddressString = JSON.stringify(newAddressJson);
      setNewAddress("");
    }
    try {
      const email = localStorage.getItem("userEmail");
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/addresses`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, new_address: newAddressString }),
      });
      if (response.ok) {
        setAddresses(newAddressJson);
      } else {
        throw new Error("Failed to delete address.");
      }
    } catch (err) {
      console.error("Error deleting address:", err);
      setError("Failed to delete address. Please try again.");
    }
    setX(!x);
  };

  useEffect(() => {
    const calculateTotal = () => {
      const totalPrice = products.reduce((sum, product) => {
        const quantity = cart[product.Product_id] || 0;
        return sum + product.price * quantity;
      }, 0);
      setTotal(totalPrice);
    };

    calculateTotal();
  }, [cart, products]);

  const handleBack = () => {
    window.history.back();
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address.");
      return;
    }
  
    const orderData = {
      customerId: localStorage.getItem("userID"), // Fetch or store customer ID from the state or session
      vendorId: sessionStorage.getItem("vendor_id"), // Fetch vendor ID based on the vendor clicked
      cart: cart, // Cart object with product ID and quantities
      deliveryAddress: selectedAddress,
    };
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/createOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert('Order placed successfully!');
        console.log(result);
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      alert('Error while placing the order: ' + error.message);
    }
  };

  if (isLoading) return <div className="cart-loading">Loading your cart...</div>;
  if (error) return <div className="cart-error">{error}</div>;

  // Render Function
return (
  <div className="cart-page">
    <div className="cart-header">
      <button className="back-button" onClick={handleBack}>← Back</button>
      <h1 className="cart-title">
        <BsFillCartFill /> Your Cart
      </h1>
    </div>

    {/* Render empty cart UI if there are no items */}
    {products.length === 0 ? (
      <div className="cart-empty">
        <h2>Your cart is empty!</h2>
        <p>Explore the menu and add delicious items to your cart.</p>
        <button className="explore-menu-button" onClick={() => navigate('/menu')}>Explore Menu</button>
      </div>
    ) : (
      <>
        {/* Delivery Address Section */}
        <div className="delivery-section">
          <h2>Delivery Address</h2>
          {addresses.length === 0 && <p>No delivery addresses found. Add one below.</p>}
          <div className="addresses-list">
            {addresses.map((address) => (
              <div key={address} className="address-item">
                <label>
                  <input
                    type="radio"
                    value={address}
                    checked={selectedAddress === address}
                    onChange={() => setSelectedAddress(address)}
                  />
                  {address}
                </label>
                <button onClick={() => handleAddressDelete(address, -1)}>Delete</button>
              </div>
            ))}
          </div>
          <div className="address-add">
            <input
              type="text"
              name="address"
              placeholder="Add a new address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
            <button onClick={() => handleAddressDelete(newAddress, +1)}>Add</button>
          </div>
        </div>

        {/* Cart Items Section */}
        <div className="cart-items-container">
          {products.map((product) => (
            <div key={product.Product_id} className="cart-item">
              <div className="cart-item-image">
                <img src={`data:image/jpeg;base64,${product.product_image}`} alt={product.Name} />
              </div>
              <div className="cart-item-details">
                <p className="item-name"><strong>{product.Name}</strong></p>
                <p className="item-price">₹{product.price.toFixed(2)}</p>
              </div>
              <div className="cart-item-actions">
                <button onClick={() => handleQuantityChange(product.Product_id, -1)}>-</button>
                <span className="item-quantity">{cart[product.Product_id]}</span>
                <button onClick={() => handleQuantityChange(product.Product_id, 1)}>+</button>
              </div>
              <p className="item-total">Subtotal: ₹{(product.price * cart[product.Product_id]).toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div className="cart-footer">
          <h2 className="cart-total">Total: ₹{total.toFixed(2)}</h2>
          <button
            className="checkout-button"
            disabled={!selectedAddress}
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </>
    )}
  </div>
);
};

export default CartPage;