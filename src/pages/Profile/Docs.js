import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import Footer from "../../components/Footer/Footer";
import { Download, Trash2, Upload, FileText, CheckCircle } from "lucide-react";

const DOCUMENT_CATEGORIES = {
  examRelated: {
    title: "Exam Related Documents",
    icon: "📝",
    description: "Documents required for exam applications and admissions",
    fields: {
      passport_size_photo_file_url: "Passport Size Photo",
      signature_file_url: "Signature",
      aadhaar_card_file_url: "Aadhaar Card / National ID / Social Security Card",
      name_change_certificate_file_url: "Name Change Certificate",
      _10th_certificate_file_url: "10th Certificate / Marksheet",
      _12th_certificate_file_url: "12th Certificate / Marksheet",
      graduation_certificate_file_url: "Graduation Certificate / Degree",
      post_graduation_certificate_file_url: "Post Graduation Certificate / Degree",
      left_thumb_file_url: "Left Thumb Impression",
      category_certificate_file_url: "Category Certificate (SC/ST/OBC)",
    }
  },
  personal: {
    title: "Personal Identification Documents",
    icon: "🆔",
    description: "Personal identification and government documents",
    fields: {
      passport_file_url: "Passport",
      drivers_license_file_url: "Driver's License",
      birth_certificate_file_url: "Birth Certificate",
      voter_id_file_url: "Voter ID",
      pan_card_file_url: "PAN Card",
      residence_card_file_url: "Residence/Green Card",
      marriage_certificate_file_url: "Marriage Certificate",
      divorce_decree_file_url: "Divorce Decree",
      caste_certificate_file_url: "Caste Certificate",
      pwd_certificate_file_url: "PWD Certificate",
      domicile_certificate_file_url: "Domicile Certificate",
      income_certificate_file_url: "Income Certificate",
      character_certificate_file_url: "Character Certificate",
    }
  }
};

// Flattened version for backward compatibility
const DOCUMENT_FIELDS = {
  ...DOCUMENT_CATEGORIES.examRelated.fields,
  ...DOCUMENT_CATEGORIES.personal.fields,
};

const Docs = ({ docUpload }) => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [customDocType, setCustomDocType] = useState("");
  const [uploading, setUploading] = useState(false);
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
  }, [isProfileFetched]);

  const getProfile = async () => {
    try {
      const response = await api.getProfile();
      setUserData(response.user_data);
      setFormData(response.user_data);

      setIsProfileFetched(true);
      localStorage.setItem("isProfileFetched", "true");
      localStorage.setItem("currentUser", JSON.stringify(response.user_data));
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    }
  };

  const getDropboxDownloadLink = (url) => {
    if (!url) return "";
    return url
      .replace("www.dropbox.com", "dl.dropboxusercontent.com")
      .replace("&dl=0", "&dl=1");
  };

  const handleFileUpload = async (fileFieldName, file) => {
    setUploading(true);

    try {
      console.log("Uploading file:", fileFieldName, file.name);

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size must be less than 10MB");
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Please upload only JPG, PNG, or PDF files");
      }

      if (!docUpload) {
        throw new Error("Document upload function not available");
      }

      await docUpload({ [fileFieldName]: file });

      // Wait a bit then refresh the profile data
      setTimeout(() => {
        getProfile();
        setUploading(false);

        // Clear the form after successful upload - clear all category form fields
        setFormData((prev) => ({
          ...prev,
          examRelated_docType: "",
          personal_docType: "",
          examRelated_customDocType: "",
          personal_customDocType: ""
        }));
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      setUploading(false);

      // Show error message
      const messageElement = document.createElement("div");
      messageElement.textContent = `Upload failed: ${error.message}`;
      messageElement.style.cssText =
        "position: fixed; top: 70px; right: 45%; padding: 10px; background: #f56565; color: white; border-radius: 4px; z-index: 1000;";
      document.body.appendChild(messageElement);
      setTimeout(() => document.body.removeChild(messageElement), 5000);
    }
  };

  const handleDeleteDoc = async (field) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );
    if (!confirmDelete) return;

    try {
      const response = await api.deleteDocument(field);
      if (response.success) {
        // Update userData by removing the deleted document field
        setUserData((prev) => ({ ...prev, [field]: null }));
        setFormData((prev) => ({ ...prev, [field]: null }));

        // Also update localStorage
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser) {
          currentUser[field] = null;
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
        }

        // Show success message
        const messageElement = document.createElement("div");
        messageElement.textContent = "Document deleted successfully!";
        messageElement.style.cssText =
          "position: fixed; top: 70px; right: 45%; padding: 10px; background: #4CAF50; color: white; border-radius: 4px; z-index: 1000;";
        document.body.appendChild(messageElement);
        setTimeout(() => document.body.removeChild(messageElement), 3000);
      }
    } catch (err) {
      console.error("Failed to delete document:", err);
      alert("Something went wrong while deleting the document, try again...");
    }
  };

  const uploadedCount = Object.entries(DOCUMENT_FIELDS).filter(
    ([field]) => userData?.[field]
  ).length;

  const getUploadedCountByCategory = (category) => {
    return Object.entries(DOCUMENT_CATEGORIES[category].fields).filter(
      ([field]) => userData?.[field]
    ).length;
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-50 rounded-full opacity-30"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-blue-100 rounded-full opacity-20"></div>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header Section - Matching Complete Your Profile Design */}
        <div className="mb-12 text-center">
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-3">
            Upload your important documents to <span className="font-semibold text-dark">Manage</span>, <span className="font-semibold text-dark">access</span> them anytime, and easily <span className="font-semibold text-dark">share</span> or <span className="font-semibold text-dark">fill complex forms</span>.
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            OCR technology extracts data from your documents to automatically
            fill forms and the Documents gets resized, cropped, compressed and change file format according to the requirements.
          </p>
        </div>

        {/* Documents Grid - Enhanced with AutoFill Theme */}
        <div className="space-y-6">
          {/* Upload Sections - Separate for each category */}
          {Object.entries(DOCUMENT_CATEGORIES).map(([categoryKey, category]) => (
            <div key={categoryKey} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              {/* Category Header */}
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-200 to-blue-300 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-lg">{category.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {getUploadedCountByCategory(categoryKey)} uploaded
                </span>
              </div>

              {/* Upload Form for this category */}
              <div className="flex flex-col sm:flex-row gap-3 items-end mb-6">
                <select
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  value={formData[`${categoryKey}_docType`] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [`${categoryKey}_docType`]: e.target.value })
                  }
                >
                  <option value="">Select document type</option>
                  {Object.entries(category.fields).map(([key, label]) => (
                    <option key={key} value={key.replace("_file_url", "")}>
                      {label}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Custom document name (optional)"
                  value={formData[`${categoryKey}_customDocType`] || ""}
                  onChange={(e) => setFormData({ ...formData, [`${categoryKey}_customDocType`]: e.target.value })}
                  onBlur={() => {
                    const customDocType = formData[`${categoryKey}_customDocType`];
                    if (customDocType && customDocType.trim()) {
                      const formattedKey =
                        customDocType.toLowerCase().replace(/\s+/g, "_") +
                        "_file_url";

                      if (!DOCUMENT_FIELDS[formattedKey]) {
                        setFormData({
                          ...formData,
                          [`${categoryKey}_docType`]: customDocType
                            .toLowerCase()
                            .replace(/\s+/g, "_"),
                        });
                      }
                    }
                  }}
                />

                <div>
                  <label
                    className={`flex items-center justify-center px-6 py-3 rounded-xl cursor-pointer transition-all duration-300 whitespace-nowrap ${
                      formData[`${categoryKey}_docType`]
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        <span className="font-medium">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        <span className="font-medium">Upload File</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        const docType = formData[`${categoryKey}_docType`];
                        if (file && docType) {
                          handleFileUpload(`${docType}_file_url`, file);
                        }
                      }}
                      disabled={!formData[`${categoryKey}_docType`] || uploading}
                    />
                  </label>
                </div>
              </div>

              {/* Uploaded Documents Grid for this category */}
              {getUploadedCountByCategory(categoryKey) > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {Object.entries(category.fields).map(([field, label]) =>
                    userData[field] ? (
                      <div
                        key={field}
                        className="rounded-xl border border-blue-200 p-4 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-200 to-blue-300 rounded-xl flex items-center justify-center group-hover:from-blue-300 group-hover:to-blue-400 transition-all duration-300">
                            <FileText className="w-5 h-5 text-dark" />
                          </div>
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        </div>

                        <h4 className="font-semibold text-gray-900 text-sm mb-3 line-clamp-2 leading-tight">
                          {label}
                        </h4>

                        <div className="flex gap-2">
                          <a
                            href={userData[field]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-center px-3 py-2 bg-gradient-to-r from-blue-300 to-blue-400 text-dark text-xs rounded-lg hover:from-blue-400 hover:to-blue-500 transition-all duration-200 font-medium"
                          >
                            View
                          </a>
                          <a
                            href={getDropboxDownloadLink(userData[field])}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-all duration-200"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <button
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-white rounded-lg transition-all duration-200"
                            onClick={() => handleDeleteDoc(field)}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Empty State - Enhanced */}
          {uploadedCount === 0 && (
            <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                No documents uploaded yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start by uploading your first document using the form above
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Secure & Encrypted Storage
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Docs;
