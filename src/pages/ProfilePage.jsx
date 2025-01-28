import React, { useState, useEffect } from "react";
import axios from "axios";
import "./profilepage.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import ContactPage from "./ContactPage";

const ProfilePage = () => {
  const [user, setUser] = useState({
    email: "",
    phone: "",
    name: "",
    Pin: "",
    Profile_Photo: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [currentFile, setCurrentFile] = useState(null);
  const navigate = useNavigate();

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (!email) {
          console.error("User not logged in");
          navigate("/signin");
        }

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/?email=${email}`
        );
        setUser(response.data || {});
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.clear(); // Clear local storage
    sessionStorage.clear(); // Clear session storage
    navigate("/signin"); // Redirect to the signin page
  };

  // Modal handling
  const openEditModal = (field, value) => {
    setCurrentField(field);
    setCurrentValue(value);
    setCurrentFile(null);
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    setCurrentFile(e.target.files[0]);
  };

  const handleSave = async () => {
    try {
      if (currentField === "Profile_Photo" && currentFile) {
        const formData = new FormData();
        formData.append("Profile_Photo", currentFile);

        const email = localStorage.getItem("userEmail");
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/photo/${email}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        setUser({ ...user, Profile_Photo: response.data.Profile_Photo });
      } else {
        const updatedUser = { ...user, [currentField]: currentValue };
        const email = localStorage.getItem("userEmail");
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/${email}`,
          { [currentField]: currentValue }
        );
        localStorage.setItem("userEmail", updatedUser.email);
        localStorage.setItem("userName", updatedUser.name);
        localStorage.setItem("userPhone", updatedUser.phone);
        setUser(updatedUser);
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="profile-page">
        <div className="logout-button">
          <button onClick={handleLogout}>Log Out</button>
        </div>
        <h1>User Profile</h1>
        <div className="profile-card">
          <div
            className="profile-image clickable"
            onClick={() => openEditModal("Profile_Photo", "")}
          >
            {user.Profile_Photo ? (
              <img
                src={`data:image/jpeg;base64,${user.Profile_Photo}`}
                alt="Profile"
              />
            ) : (
              <div className="placeholder-image">No Image</div>
            )}
          </div>
          <div className="profile-info">
            <div className="profile-field">
              <strong>Email:</strong> {user.email}
              <button onClick={() => openEditModal("email", user.email)}>
                Edit
              </button>
            </div>
            <div className="profile-field">
              <strong>Phone:</strong> {user.phone}
              <button onClick={() => openEditModal("phone", user.phone)}>
                Edit
              </button>
            </div>
            <div className="profile-field">
              <strong>Name:</strong> {user.name}
              <button onClick={() => openEditModal("name", user.name)}>
                Edit
              </button>
            </div>
            <div className="profile-field">
              <strong>Pin Code:</strong> {user.Pin}
              <button onClick={() => openEditModal("Pin", user.Pin)}>
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>
                Edit {currentField.charAt(0).toUpperCase() + currentField.slice(1)}
              </h2>
              {currentField === "Profile_Photo" ? (
                <input type="file" onChange={handleFileChange} />
              ) : (
                <input
                  type="text"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  placeholder={`Enter new ${currentField}`}
                />
              )}
              <div className="modal-buttons">
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ContactPage />
      <Footer />
    </>
  );
};

export default ProfilePage;
