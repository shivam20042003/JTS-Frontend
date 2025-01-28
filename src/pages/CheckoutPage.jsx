import React from "react";
import { useLocation, useNavigate } from "react-router-dom";


const CheckoutPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { cart, total } = state || { cart: {}, total: 0 };

  const handlePlaceOrder = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      alert("Please log in to proceed with the order.");
      navigate("/signin");
      return;
    }

    try {
      const orderResponse = await fetch("http://localhost:8800/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, cart, total }),
      });

      if (!orderResponse.ok) throw new Error("Failed to place order.");

      const orderData = await orderResponse.json();
      alert("Order placed successfully!");
      navigate("/ordersummary", { state: orderData });
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again later.");
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-summary">
        <h2>Order Summary</h2>
        <ul>
          {Object.entries(cart).map(([productId, quantity]) => (
            <li key={productId}>
              Product ID: {productId} - Quantity: {quantity}
            </li>
          ))}
        </ul>
        <h2>Total: ₹{total.toFixed(2)}</h2>
      </div>
      <div className="checkout-actions">
        <button className="back-to-cart" onClick={() => navigate("/order")}>
          Back to Cart
        </button>
        <button className="place-order-button" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;