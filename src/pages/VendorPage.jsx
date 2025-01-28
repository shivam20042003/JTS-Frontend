import React, { useState, useEffect } from "react";
import "./vendorPage.css";
import MenuPage from "./MenuPage";
import Header from "../components/Header/Header";
import Footer from "../components/footer/Footer";

const VendorPage = () => {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch Vendors on Load
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getVendors`);
        if (!response.ok) {
          throw new Error("Failed to fetch vendors.");
        }
        const data = await response.json();
        setVendors(data);
        if (sessionStorage.getItem("vendor_id")){
            setSelectedVendor(sessionStorage.getItem("vendor_id"));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

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

  // Fetch Menu Items for a Selected Vendor

  return (
    <div className="vendor-page">
        <Header />
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* Vendor Profile Section */}
      {!selectedVendor && (
        <div className="vendor-list">
          <h2>Select a Vendor</h2>
          <div className="vendors">
            {vendors.map((vendor) => (
              <div
                key={vendor.Vendor_id}
                className="vendor"
                onClick={() => {setSelectedVendor(vendor.Vendor_id);
                    sessionStorage.setItem("vendor_id", vendor.Vendor_id);
                }}
              >
                <img
                  src={`data:image/jpeg;base64,${vendor.profile_photo}`}
                  alt={vendor.Name}
                  className="vendor-image"
                />
                <p>{vendor.Name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu Section */}
      {selectedVendor && <div>
        <button
            className="back-button"
            onClick={() => {
                updateCartAPI({});
                sessionStorage.removeItem("vendor_id");
              setSelectedVendor(null);
            }}
          >
            Back to Vendor Page
          </button> 
           <MenuPage props={ selectedVendor} /></div> }
      <Footer />
    </div>
  );
};

export default VendorPage;
