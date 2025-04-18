import React, { useEffect, useState } from 'react';
import './Profile.css';
import { api } from '../../services/api';

function Profile({ applications }) {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    shortlisted: 0,
    applied: 0
  });
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserData(user);
      setFormData(user);
    }
  }, []);

  useEffect(() => {
    if (applications) {
      const newStats = {
        total: applications.length,
        shortlisted: applications.filter(app => app.isShortlisted).length,
        applied: applications.filter(app => app.isApplied).length
      };
      setStats(newStats);
    }
  }, [applications]);

  const getProfile = async () => {
    try {
      const response = await api.getProfile();
      setUserData(response.user_data);
      setFormData(response.user_data);
    } catch (error) {
      console.error('Profile fetch error:', error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleDocumentClick = (documentUrl, documentType) => {
    if (!documentUrl) {
      console.log('No document URL provided for:', documentType);
      return;
    }

    // Check if the URL is a base64 string or a regular URL
    const isBase64 = documentUrl.startsWith('data:');
    const isPdf = documentUrl.toLowerCase().endsWith('.pdf') || documentUrl.toLowerCase().includes('application/pdf');
    documentUrl = "https://drive.google.com/file/d/1r9oOPrn-fKok9pieYVL4HkiP0IU-Oq2C/view?usp=drive_link"
    // isPdf = true; 
    console.log('Opening document:', {
      type: documentType,
      url: documentUrl,
      isBase64,
      isPdf
    });

    if (isPdf) {
      setSelectedDocument({
        url: documentUrl,
        type: documentType,
        isPdf: true,
        html: `<iframe src="${documentUrl}" style="width: 100%; height: 100%; border: none;"></iframe>`
      });
    } else {
      setSelectedDocument({
        url: documentUrl,
        type: documentType,
        isPdf: false,
        html: `<img src="${documentUrl}" alt="${documentType}" style="max-width: 100%; max-height: 100%; object-fit: contain;"/>`
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDocument(null);
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile({ file, field });
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [field]: reader.result
        }));
      };
      reader.readAsDataURL(file);
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
    <main className="main-content">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar" onClick={() => handleDocumentClick(userData.profile_photo, 'Profile Photo')}>
            <img src={userData.profile_photo} alt="Profile" />
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'profile_photo')}
                className="file-input"
              />
            )}
          </div>
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
                <label>Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username || ''}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                ) : (
                  <p>{userData.username || 'Not provided'}</p>
                )}
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{userData.email}</p>
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
                <label>Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                ) : (
                  <p>{userData.city || 'Not provided'}</p>
                )}
              </div>
              <div className="info-item">
                <label>State</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="state"
                    value={formData.state || ''}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                ) : (
                  <p>{userData.state || 'Not provided'}</p>
                )}
              </div>
              <div className="info-item">
                <label>Country</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="country"
                    value={formData.country || ''}
                    onChange={handleInputChange}
                    className="edit-input"/>
                ) : (
                  <p>{userData.country || 'Not provided'}</p>
                )}
              </div>
              <div className="info-item">
                <label>Pincode</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode || ''}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                ) : (
                  <p>{userData.pincode || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Documents</h3>
            <div className="documents-grid">
              <div className="document-card" onClick={() => handleDocumentClick(userData.aadhaar_card, 'Aadhaar Card')}>
                <div className="document-icon">A</div>
                <span>Aadhaar Card</span>
                {isEditing && (
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileChange(e, 'aadhaar_card')}
                    className="file-input"
                  />
                )}
              </div>
              <div className="document-card" onClick={() => handleDocumentClick(userData.pan_card, 'PAN Card')}>
                <div className="document-icon">P</div>
                <span>PAN Card</span>
                {isEditing && (
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileChange(e, 'pan_card')}
                    className="file-input"
                  />
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

        <div className="profile-section">
          <h3>Application Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Applications</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.shortlisted}</span>
              <span className="stat-label">Shortlisted</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.applied}</span>
              <span className="stat-label">Applied</span>
            </div>
          </div>
        </div>
      </div>

      {showModal && selectedDocument && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>×</button>
            <h3>{selectedDocument.type}</h3>
            <div 
              className="document-viewer"
              dangerouslySetInnerHTML={{ __html: selectedDocument.html }}
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default Profile; 