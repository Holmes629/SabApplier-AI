import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './Docs.css';

const Docs = ({ docUpload }) => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserData(user);
      setFormData(user);
    }
  }, []);

  const getProfile = async () => {
    const loader = document.createElement('div');
    loader.textContent = 'Fetching documents please wait...';
    loader.style.cssText = 'position: fixed; top: 130px; left:50%; transform: translate(-50%, -50%);; padding: 10px; background: #2196F3; color: white; border-radius: 4px; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.2);';
    document.body.appendChild(loader);
    try {
      const response = await api.getProfile();
      setUserData(response.user_data);
      setFormData(response.user_data);
      document.body.removeChild(loader);
    } catch (error) {
      console.log(error);
      loader.textContent = 'Failed to fetch docs, please try again...'
      loader.style.cssText = 'position: fixed; top: 130px; left:50%; transform: translate(-50%, -50%); padding: 10px; background:rgb(254, 0, 0); color: white; border-radius: 4px; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.2);';
      document.body.appendChild(loader);
      setTimeout(() => {
        document.body.removeChild(loader);
      }, 1000);
      return { success: false, message: error.message };
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles(prev => ({
      ...prev,
      [name]: files[0]
    }));
    setError('');
  };

  const handleFileUpload = async (fileFieldName, file) => {
     // Create loader element
    const loader = document.createElement('div');
    loader.textContent = 'Uploading...';
    loader.style.cssText = 'position: fixed; top: 130px; left: 50%; transform: translate(-50%, -50%); padding: 10px; background: #2196F3; color: white; border-radius: 4px; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.2);';
    document.body.appendChild(loader);
    try {
      const response = await docUpload({
        [fileFieldName]: file
      });

      document.body.removeChild(loader);
       // Display message to user
       const messageElement = document.createElement('div');
       messageElement.textContent = 'File Upload successful... please wait syncing with backend';
       messageElement.style.cssText = 'position: fixed; top: 130px; left: 50%; transform: translate(-50%, -50%); padding: 10px; background: #4CAF50; color: white; border-radius: 4px; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.2);';
       document.body.appendChild(messageElement);
       setTimeout(() => {
        getProfile();   // <-- Refresh the page after 1 second
        document.body.removeChild(messageElement);
      }, 1000);
      
       return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  if (!userData) {
    return <div className="docs-container">Loading documents...</div>;
  }

  return (
    <div className="docs-container">
      <div className="docs-header">
        <h2>My Documents</h2>
        <div className="upload-section">
          <select 
            className="doc-type-select"
            value={formData.docType || ''}
            onChange={(e) => setFormData({...formData, docType: e.target.value})}
          >
            <option value="">Select Document Type</option>
            <option value="passport_size_photo">Passport Size Photo</option>
            <option value="aadhaar_card">Aadhaar Card</option>
            <option value="pan_card">PAN Card</option>
            <option value="signature">Signature</option>
            <option value="_10th_certificate">10th Marksheet</option>
            <option value="_12th_certificate">12th Marksheet</option>
            <option value="graduation_certificate">Graduation Marksheet</option>
          </select>
          
          <label className="bulk-upload-button">
            Upload Document
            <input
              type="file"
              id="file"
              name="file"
              accept={'.pdf,image/*'}
              onChange={(e) => {
                const file = e.target.files[0];
                const field = `${formData.docType}_file_url`;
                if (file && field) {
                  handleFileUpload(field, file);
                }
              }}
              disabled={!formData.docType}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <div className="profile-section">
        <h3>My Documents</h3>
        <div className="documents-grid">
          {userData.passport_size_photo_file_url && (
            <div className="document-card">
              <a href={userData.passport_size_photo_file_url} target="_blank" rel="noopener noreferrer">   
                <svg xmlns="https://www.w3.org/2000/svg" height="90" width="90" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="0.7">
                  <path d="M6 2h9l5 5v15H6z"/>
                  <path d="M14 2v6h6"/>
                </svg>
                <div className='document-name'>Passport Size Photo</div>
              </a>
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange}
                  className="file-input"
                />
              )}
            </div>
          )}
          {userData.aadhaar_card_file_url && (
            <div className="document-card">
              <a href={userData.aadhaar_card_file_url} target="_blank" rel="noopener noreferrer">   
                <svg xmlns="https://www.w3.org/2000/svg" height="90" width="90" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="0.7">
                  <path d="M6 2h9l5 5v15H6z"/>
                  <path d="M14 2v6h6"/>
                </svg>
                <div className='document-name'>Aadhaar Card</div>
              </a>
              {isEditing && (
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileChange}
                  className="file-input"
                />
              )}
            </div>
          )}
          {userData.pan_card_file_url && (
            <div className="document-card">
              <a href={userData.pan_card_file_url} target="_blank" rel="noopener noreferrer">
                <svg xmlns="https://www.w3.org/2000/svg" height="90" width="90" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="0.7">
                  <path d="M6 2h9l5 5v15H6z"/>
                  <path d="M14 2v6h6"/>
                </svg>
                <div className='document-name'>PAN Card</div>
              </a>
              {isEditing && (
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileChange}
                  className="file-input"
                />
              )}
            </div>
          )}
          {userData.signature_file_url && (
            <div className="document-card">
              <a href={userData.signature_file_url} target="_blank" rel="noopener noreferrer">
                <svg xmlns="https://www.w3.org/2000/svg" height="90" width="90" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="0.7">
                  <path d="M6 2h9l5 5v15H6z"/>
                  <path d="M14 2v6h6"/>
                </svg>
                <div className='document-name'>Signature</div>
              </a>
              {isEditing && (
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileChange}
                  className="file-input"
                />
              )}
            </div>
          )}
          {userData._10th_certificate_file_url && (
            <div className="document-card">
              <a href={userData._10th_certificate_file_url} target="_blank" rel="noopener noreferrer">
                <svg xmlns="https://www.w3.org/2000/svg" height="90" width="90" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="0.7">
                  <path d="M6 2h9l5 5v15H6z"/>
                  <path d="M14 2v6h6"/>
                </svg>
                <div className='document-name'>10th Certificate</div>
              </a>
              {isEditing && (
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileChange}
                  className="file-input"
                />
              )}
            </div>
          )}
          {userData._12th_certificate_file_url && (
            <div className="document-card">
              <a href={userData._12th_certificate_file_url} target="_blank" rel="noopener noreferrer">
                <svg xmlns="https://www.w3.org/2000/svg" height="90" width="90" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="0.7">
                  <path d="M6 2h9l5 5v15H6z"/>
                  <path d="M14 2v6h6"/>
                </svg>
                <div className='document-name'>12th Certificate</div>
              </a>
              {isEditing && (
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileChange}
                  className="file-input"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Docs; 