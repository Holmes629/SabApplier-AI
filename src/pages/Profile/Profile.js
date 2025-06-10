import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer/Footer';
import './Profile.css';
import { api } from '../../services/api';

function Profile() {
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProfileFetched, setIsProfileFetched] = useState(
    localStorage.getItem("isProfileFetched") === "true"
  );


  useEffect(() => {
    if (!isProfileFetched) {
      getProfile();
    } else {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setUserData(user);
        setFormData(user);
      }
    }
  }, []);


  const getProfile = async () => {
    try {
      const response = await api.getProfile();
      setUserData(response.user_data);
      setFormData(response.user_data);

      // Set flipper state
      setIsProfileFetched(true);
      localStorage.setItem("isProfileFetched", "true");
      // Also update localStorage with new data
      localStorage.setItem("currentUser", JSON.stringify(response.user_data));
    } catch (error) {
      console.error('Profile fetch error:', error);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'profile_photo' && key !== 'aadhaar_card' && key !== 'pan_card') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append files if they were selected
      if (selectedFile) {
        formDataToSend.append(selectedFile.field, selectedFile.file);
      }

      const response = await api.updateProfile(formDataToSend);
      setUserData(response.user_data);
      setIsEditing(false);
      setSelectedFile(null);

      // Update localStorage
      localStorage.setItem("currentUser", JSON.stringify(response.user_data));

      // Show success message
      const messageElement = document.createElement('div');
      messageElement.textContent = 'Profile updated successfully';
      messageElement.style.cssText = 'position: fixed; top: 50px; right: 45%; padding: 10px; background:rgb(56, 250, 63); color: white; border-radius: 4px; z-index: 1000;';
      document.body.appendChild(messageElement);
      setTimeout(() => document.body.removeChild(messageElement), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  if (!userData) {
    return <div className="main-content">Loading profile...</div>;
  }

  return (
    <div className="body">
      <main className="main-content">
        <div className="profile-container">
          <div className="profile-header">
            <h2 className="page-title">My Profile</h2>
            <button 
              className="edit-button"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="profile-section">
              <h3>Personal Information</h3>
              <div className="profile-info">
                <div className="info-item">
                  <label>Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={formData.fullName || ''}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  ) : (
                    <p>{userData.fullName || 'Not provided'}</p>
                  )}
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{userData.email}</p>
                </div>
                <div className="info-item">
                  <label>Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="Date"
                      name="dateofbirth"
                      value={formData.dateofbirth || ''}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  ) : (
                    <p>{userData.dateofbirth || 'Not provided'}</p>
                  )}
                </div>
                <div className="info-item">
                  <label>Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number || ''}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  ) : (
                    <p>{userData.phone_number || 'Not provided'}</p>
                  )}
                </div>
                <div className="info-item">
                  <label>Address</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  ) : (
                    <p>{userData.address || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="profile-section">
                <button type="submit" className="submit-button">
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Profile; 