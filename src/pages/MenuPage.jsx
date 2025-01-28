import React, { useEffect, useState,useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "./menuPage.css";

const MenuPage = (props) => {
  const [menuItems, setMenuItems] = useState([]);
  const [vendorNames, setVendorNames] = useState({});
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0); // Tracks the total cart count
  const [feedback, setFeedback] = useState(""); // Feedback message on Add/Remove
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getProducts?Vendor_id=${props.props}`);
        if (!response.ok) {
          throw new Error("Failed to fetch menu data.");
        }
        const data = await response.json();
        setMenuItems(data);
        const uniqueVendorIds = [...new Set(data.map((item) => item.Vendor_id))];
        const vendorData = await fetchVendorNames(uniqueVendorIds);
        setVendorNames(vendorData);
        fetchCart();
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const fetchCart = async () => {
    if (localStorage.getItem("authToken")) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/user/cart?email=${localStorage.getItem("userEmail")}`
        );
        if (!response.ok) {
          console.error("Failed to fetch cart");
        }
        const data = await response.json();
        setCart(data.cart);
        setCartCount(Object.values(data.cart).reduce((acc, curr) => acc + curr, 0)); // Update cart count
      } catch (error) {
        console.error("Error fetching cart data");
      }
    }
  };

  const fetchVendorNames = async (vendorIds) => {
    const vendorData = {};
    for (const id of vendorIds) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/vendor/name?Vendor_id=${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch vendor data");
        }
        const data = await response.json();
        vendorData[id] = data.Name; 
      } catch (error) {
        console.error(`Error fetching vendor name for ID ${id}:`, error);
      }
    }
    return vendorData;
  };

  const updateCartAPI = async (cart) => {
    if (!localStorage.getItem("authToken")) {
      navigate("/signin");
    } else {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/cart`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: localStorage.getItem("userEmail"),
            cart: cart,
          }),
        });

        if (response.ok) {
          return;
        } else {
          const error = await response.json();
          alert(error.error);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong!");
      }
    }
  };

  const getImageSrc = (imageBuffer) => {
    if (!imageBuffer || !imageBuffer.data) return null;
    try {
      const base64String = btoa(
        String.fromCharCode(...new Uint8Array(imageBuffer.data))
      );
      return `data:image/jpeg;base64,${base64String}`;
    } catch (error) {
      console.error("Error converting image buffer to Base64:", error);
      return null;
    }
  };

  const handleAddToCart = (productId) => {
    setCart((prevCart) => {
      return {
        ...prevCart,
        [productId]: (prevCart[productId] || 0) + 1,
      };
    });

    const newCart = {
      ...cart,
      [productId]: (cart[productId] || 0) + 1,
    };

    setCartCount((prevCount) => prevCount + 1); // Increment cart count
    setFeedback("Added to Cart"); // Provide feedback
    setTimeout(() => setFeedback(""), 2000); // Hide feedback after 2 seconds
    updateCartAPI(newCart);
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => {
      if (!prevCart[productId]) return prevCart;

      if (prevCart[productId] <= 1) {
        const { [productId]: _, ...rest } = prevCart; 
        return rest;
      }
      return {
        ...prevCart,
        [productId]: prevCart[productId] - 1,
      };
    });

    let newCart;
    if(!cart[productId]) {
      newCart = cart;
    }
    else{
      if (cart[productId] <= 1) {
        const { [productId]: _, ...rest } = cart;
        newCart = rest;
      } else {
        newCart = {
          ...cart,
          [productId]: cart[productId] - 1,
        };
      }
    }

    setCartCount((prevCount) => {if(prevCount==0){return 0} else {return prevCount - 1}}); 
    setFeedback("Removed from Cart");
    setTimeout(() => setFeedback(""), 2000);
    updateCartAPI(newCart);
  };



  const hasItemsInCart = Object.keys(cart).some((productId) => cart[productId] > 0);

  const goToCart = () => {
    const isLogged = localStorage.getItem("authToken");
    if (isLogged) {
      navigate("/order"); 
    } else {
      navigate("/signin");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      
      <div className="menu-container">
        <h1>Our Menu</h1>
        <div className="menu-items">
  {menuItems.map((item) => (
    <div className="menu-card" key={item.Product_id}>
      <div className="product-image-wrapper">
        {item.product_image ? (
          <img
            src={`data:image/jpeg;base64,${item.product_image}`}
            alt={item.Name}
            className="product-image"
          />
        ) : (
          <div className="no-image">Image Not Available</div>
        )}
      </div>
      <div className="product-details">
        <h3 className="product-name">{item.Name}</h3>
        <div className="product-meta">
          <span className="product-price">₹{item.price.toFixed(2)}</span>
          <div className="quantity-controls">
            <button
              onClick={() => handleRemoveFromCart(item.Product_id)}
              className="remove-button"
            >
              -
            </button>
            <span className="quantity">{cart[item.Product_id] || 0}</span>
            <button
              onClick={() => handleAddToCart(item.Product_id)}
              className="add-button"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className="product-hover-description">
        <p className="product-description">{item.Description}</p>
      </div>
    </div>
  ))}
</div>
</div>

      {hasItemsInCart && (
        <div className="cart-button-container">
          <button className="cart-button" onClick={goToCart}>
            Go to Cart ({cartCount} items)
          </button>
        </div>
      )}

      {feedback && <div className="feedback-message">{feedback}</div>}
      
      
    </div>
  );
};

export default MenuPage;