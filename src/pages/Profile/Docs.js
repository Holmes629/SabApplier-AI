import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Footer from '../../components/Footer/Footer';
import { Download, Trash2 } from 'lucide-react'; 
import './Docs.css';

const DOCUMENT_FIELDS = {
  passport_size_photo_file_url: 'Passport Size Photo',
  aadhaar_card_file_url: 'Aadhaar Card',
  pan_card_file_url: 'PAN Card',
  signature_file_url: 'Signature',
  _10th_certificate_file_url: '10th Certificate',
  _12th_certificate_file_url: '12th Certificate',
  graduation_certificate_file_url: 'Graduation Certificate',
  left_thumb_file_url: 'Left Thumb',
  caste_certificate_file_url: 'Caste Certificate',
  pwd_certificate_file_url: 'PWD Certificate',
  domicile_certificate_file_url: 'Domicile Certificate',
};

const Docs = ({ docUpload }) => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [customDocType, setCustomDocType] = useState('');
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
    const loader = document.createElement('div');
    loader.textContent = 'Fetching documents...';
    loader.style.cssText =
      'position: fixed; top: 130px; left:50%; transform: translate(-50%, -50%); padding: 10px; background: #2196F3; color: white; border-radius: 4px; z-index: 1000;';
    document.body.appendChild(loader);

    try {
      const response = await api.getProfile();
      setUserData(response.user_data);
      setFormData(response.user_data);

      setIsProfileFetched(true);
      localStorage.setItem("isProfileFetched", "true");
      localStorage.setItem("currentUser", JSON.stringify(response.user_data));

      document.body.removeChild(loader);
    } catch (error) {
      loader.textContent = 'Failed to fetch docs.';
      loader.style.background = 'red';
      setTimeout(() => {
        document.body.removeChild(loader);
      }, 1500);
    }
  };

  const getDropboxDownloadLink = (url) => {
    if (!url) return '';
    return url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('&dl=0', '&dl=1'); 
  };
  

  const handleFileUpload = async (fileFieldName, file) => {
    const loader = document.createElement('div');
    loader.textContent = 'Uploading...';
    loader.style.cssText =
      'position: fixed; top: 130px; left:50%; transform: translate(-50%, -50%); padding: 10px; background: #2196F3; color: white; border-radius: 4px; z-index: 1000;';
    document.body.appendChild(loader);

    try {
      await docUpload({ [fileFieldName]: file });
      document.body.removeChild(loader);

      const message = document.createElement('div');
      message.textContent = 'File uploaded successfully!';
      message.style.cssText =
        'position: fixed; top: 130px; left:50%; transform: translate(-50%, -50%); padding: 10px; background: #4CAF50; color: white; border-radius: 4px; z-index: 1000;';
      document.body.appendChild(message);
      setTimeout(() => {
        getProfile();
        document.body.removeChild(message);
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteDoc = async (field) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this document?");
    if (!confirmDelete) return;

    try {
      const loader = document.createElement('div');
      loader.textContent = 'Deleting...';
      loader.style.cssText =
        'position: fixed; top: 130px; left:50%; transform: translate(-50%, -50%); padding: 10px; background: #2196F3; color: white; border-radius: 4px; z-index: 1000;';
      document.body.appendChild(loader);

      const response = await api.delete({ field });
      document.body.removeChild(loader);

      if (response.success) {
        const message = document.createElement('div');
        message.textContent = 'File deleted successfully!';
        message.style.cssText =
          'position: fixed; top: 130px; left:50%; transform: translate(-50%, -50%); padding: 10px; background: #4CAF50; color: white; border-radius: 4px; z-index: 1000;';
        document.body.appendChild(message);
        setTimeout(() => {
         // Set the deleted field to null in userData and formData
          setUserData((prev) => ({ ...prev, [field]: null }));
          setFormData((prev) => ({ ...prev, [field]: null }));
          document.body.removeChild(message);
        }, 1000);
      }
    } catch (err) {
      console.error("Failed to delete document:", err);
      alert("Something went wrong while deleting the document, try again...");
    }
  };
  

  if (!userData) return <div className="docs-container">Loading documents...</div>;

  return (
    <div className="body">
      <div className="docs-container">
        <div className="docs-header">
          <h2>My Documents</h2>
          <div className="upload-section">
            <select
              className="doc-type-select"
              value={formData.docType || ''}
              onChange={(e) =>
                setFormData({ ...formData, docType: e.target.value })
              }
            >
              <option value="">Select Document Type</option>
              {Object.entries(DOCUMENT_FIELDS).map(([key, label]) => (
                <option key={key} value={key.replace('_file_url', '')}>
                  {label}
                </option>
              ))}
            </select>

            <input
              type="text"
              className="custom-doc-input"
              placeholder="Or enter custom document name"
              value={customDocType}
              onChange={(e) => setCustomDocType(e.target.value)}
              onBlur={() => {
                if (customDocType.trim()) {
                  const formattedKey = customDocType
                    .toLowerCase()
                    .replace(/\s+/g, '_') + '_file_url';

                  if (!DOCUMENT_FIELDS[formattedKey]) {
                    const updatedFields = {
                      ...DOCUMENT_FIELDS,
                      [formattedKey]: customDocType.trim(),
                    };
                    // setDocumentFields(updatedFields);
                    setFormData({
                      ...formData,
                      docType: customDocType.toLowerCase().replace(/\s+/g, '_'),
                    });
                  }
                }
              }}
            />

            <label className="bulk-upload-button">
              Upload Document
              <input
                type="file"
                accept=".pdf,image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  const docType = formData.docType;
                  if (file && docType) {
                    handleFileUpload(`${docType}_file_url`, file);
                  }
                }}
                disabled={!formData.docType}
              />
            </label>
          </div>
        </div>

        <div className="profile-section">
          <h3>Uploaded Documents</h3>
          <div className="documents-grid">
            {Object.entries(DOCUMENT_FIELDS).map(([field, label]) =>
              userData[field] ? (
                <div className="document-card" key={field}>
                  <a
                    href={userData[field]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="90"
                      width="90"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="black"
                      strokeWidth="0.7"
                    >
                      <path d="M6 2h9l5 5v15H6z" />
                      <path d="M14 2v6h6" />
                    </svg>
                    <div className="document-name">{label}</div>
                  </a>
                  <a
                    href={getDropboxDownloadLink(userData[field])}
                    // href="https://dl.dropboxusercontent.com/scl/fi/3pxqni3wvh7dc58s8uzf0/demoemail_signature.jpg?rlkey=ttal9t2e1xye7g3hz5bn95s2w&dl=1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="download-doc-button">
                      <Download/>
                    </button>
                  </a>
                  <button className="delete-doc-button" onClick={() => handleDeleteDoc(field)} title="Delete">
                    <Trash2 color="red" />
                  </button>
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Docs;