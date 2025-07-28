import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import Footer from "../../components/Footer/Footer";
import { Download, Trash2, Upload, FileText, CheckCircle } from "lucide-react";

// 1. Replace DOCUMENT_CATEGORIES and DOCUMENT_FIELDS with only the required fields 
// 
const MAIN_DOC_FIELDS = {
  passport_size_photo_file_url: "Passport Size Photo",
  signature_file_url: "Signature",
  aadhaar_card_file_url: "Aadhaar Card",
  category_certificate_file_url: "Caste Certificate",
  _10th_certificate_file_url: "10th Certificate",
  _12th_certificate_file_url: "12th Certificate",
  graduation_certificate_file_url: "Graduation Certificate",
  left_thumb_file_url: "Left Thumb Impression"
};
const MAIN_DROPDOWN_FIELDS = [
  { key: "category_certificate_file_url", label: "Caste Certificate" },
  { key: "_10th_certificate_file_url", label: "10th Certificate" },
  { key: "aadhaar_card_file_url", label: "Aadhaar Card" },
  { key: "left_thumb_file_url", label: "Left Thumb" },
  { key: "_12th_certificate_file_url", label: "12th Certificate" },
  { key: "graduation_certificate_file_url", label: "Graduation Certificate" }
];

const Docs = ({ docUpload }) => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadingField, setUploadingField] = useState(null); // NEW: track which field is uploading
  const [isProfileFetched, setIsProfileFetched] = useState(
    localStorage.getItem("isProfileFetched") === "true"
  );
  const [imgError, setImgError] = useState({});
  const [showCustomTooltip, setShowCustomTooltip] = useState(false);
  const [showSelectTooltip, setShowSelectTooltip] = useState(false);
  const [showMainDocTooltip, setShowMainDocTooltip] = useState({});

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

  const getDropboxViewLink = (url) => {
    if (!url) return "";
    if (url.includes(".pdf")) {
      // Ensure it's using www.dropbox.com and has raw=1
      return url
        .replace("dl=0", "raw=1");
    }
    return url
      .replace("www.dropbox.com", "dl.dropboxusercontent.com");
  };

  const getDropboxDownloadLink = (url) => {
    if (!url) return "";
    return url
      .replace("www.dropbox.com", "dl.dropboxusercontent.com")
      .replace("&dl=0", "&dl=1");
  };

  const handleFileUpload = async (fileFieldName, file) => {
    setUploading(true);
    setUploadingField(fileFieldName); // NEW: set uploading field

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

      // Determine if this is a custom doc (not in DOCUMENT_FIELDS)
      let customDocCategories = {};
      let categoryKey = null;
      Object.entries(MAIN_DOC_FIELDS).forEach(([catKey, cat]) => {
        if (catKey === fileFieldName) {
          categoryKey = catKey;
        }
      });
      // If not found in standard fields, treat as custom and use current formData
      if (!categoryKey) {
        // Find which category's docType matches this upload
        Object.entries(MAIN_DOC_FIELDS).forEach(([catKey, cat]) => {
          if (formData[`${catKey}_docType`] && `${formData[`${catKey}_docType`]}_file_url` === fileFieldName) {
            categoryKey = catKey;
          }
        });
        if (categoryKey) {
          customDocCategories[fileFieldName] = categoryKey;
        }
      }

      // Send custom_doc_categories if needed
      await docUpload({ [fileFieldName]: file, ...(Object.keys(customDocCategories).length > 0 ? { custom_doc_categories: customDocCategories } : {}) });

      // Wait a bit then refresh the profile data
      setTimeout(() => {
        getProfile();
        setUploading(false);
        setUploadingField(null); // NEW: reset uploading field

        // Clear the form after successful upload - clear all category form fields
        setFormData((prev) => ({
          ...prev,
          docType: "",
          examRelated_customDocType: "",
          personal_customDocType: ""
        }));
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      setUploading(false);
      setUploadingField(null); // NEW: reset uploading field

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
        // Refresh profile to update allDocuments and UI
        await getProfile();

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

  // Helper to prettify field names
  const prettifyFieldName = (field) => {
    // Remove _file_url and replace underscores with spaces, capitalize
    return field.replace(/_file_url$/, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  // Instead of only using DOCUMENT_FIELDS, use all_documents from userData
  const allDocuments = userData?.all_documents || {};

  // Count all uploaded docs (including custom)
  const uploadedCount = Object.keys(allDocuments).length;

  // Count uploaded docs by category (including custom docs mapped to this category)
  const getUploadedCountByCategory = (category, categoryKey) => {
    const customDocCategories = userData?.custom_doc_categories || {};
    return Object.keys(allDocuments).filter(field =>
      category.fields[field] || Object.entries(customDocCategories).some(([customField, catKey]) => customField === field && catKey === categoryKey)
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

  console.log("allDocuments from backend:", allDocuments);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-50 rounded-full opacity-30"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-blue-100 rounded-full opacity-20"></div>
      </div>
      {/* Security Message */}
      <div className="w-full flex justify-center mt-6 mb-2 z-20 relative">
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-6 py-3 shadow-sm">
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657-1.343-3-3-3s-3 1.343-3 3c0 1.306.835 2.417 2 2.83V17a1 1 0 001 1h2a1 1 0 001-1v-3.17c1.165-.413 2-1.524 2-2.83z" /></svg>
          <span className="text-green-700 font-semibold text-lg">Your data is secured, safe, and always in your control.</span>
        </div>
      </div>
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header Section - Matching Complete Your Profile Design */}
        <div className="mb-12 text-center">
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-3">
            Upload your important documents to <span className="font-semibold text-dark">Manage</span>, <span className="font-semibold text-dark">access</span> them anytime, and easily <span className="font-semibold text-dark">share</span> or <span className="font-semibold text-dark">fill complex forms</span>.
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Documents get resized, cropped, compressed and change file format according to the from requirements.
          </p>
        </div>
        {/* Single merged card for all uploads, keep card/grid style */}
        <div className="space-y-6">
          {/* 1. Add heading above upload card */}
          
          <div className="rounded-xl border border-gray-100 p-6  mb-6">

          <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-200 to-blue-300 rounded-xl flex items-center justify-center mr-3">
                <span className="text-lg">📝</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">Common Exam Application Documents</h3>
                <p className="text-sm text-gray-600">We recommend uploading these documents for a smooth application process.</p>
              </div>
              
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "passport_size_photo_file_url",
                "signature_file_url"
              ].map((field) => {
                const url = allDocuments[field];
                const isImage = url && !imgError[field];
                const isPDF = url && url.endsWith(".pdf");
                const isUploadingThis = uploadingField === field; // NEW
                return (
                  <div key={field} className="rounded-xl border border-blue-200 p-4 flex flex-col items-center hover:shadow-lg transition-all duration-300 group bg-blue-50/30">
                    <div className="mb-2 text-center font-semibold text-gray-800 flex items-center gap-2">
                      {MAIN_DOC_FIELDS[field]}
                      <div className="relative inline-block">
                        <span
                          className="text-xs text-gray-400 cursor-help"
                          onMouseEnter={() => setShowMainDocTooltip(prev => ({ ...prev, [field]: true }))}
                          onMouseLeave={() => setShowMainDocTooltip(prev => ({ ...prev, [field]: false }))}
                          onFocus={() => setShowMainDocTooltip(prev => ({ ...prev, [field]: true }))}
                          onBlur={() => setShowMainDocTooltip(prev => ({ ...prev, [field]: false }))}
                          tabIndex={0}
                          aria-describedby={`main-doc-tooltip-${field}`}
                        >
                          ⓘ
                        </span>
                        {showMainDocTooltip[field] && (
                          <div
                            id={`main-doc-tooltip-${field}`}
                            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap"
                            role="tooltip"
                          >
                            Accepted: JPG, PNG, PDF.
                          </div>
                        )}
                      </div>
                    </div>
                    {isUploadingThis ? (
                      <div className="w-24 h-24 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-300 border-t-transparent"></div>
                      </div>
                    ) : url ? (
                      <div className="w-full flex flex-col items-center">
                        <div className="w-24 h-24 mb-2 flex items-center justify-center border border-green-300 rounded-xl overflow-hidden bg-green-50">
                          {isImage && !isPDF ? (
                            <a href={getDropboxViewLink(url)} target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center">
                              <img
                                src={getDropboxViewLink(url)}
                                alt={MAIN_DOC_FIELDS[field]}
                                className="object-contain w-full h-full cursor-pointer hover:scale-105 transition-transform duration-200"
                                onError={() => setImgError(prev => ({ ...prev, [field]: true }))}
                              />
                            </a>
                          ) : isPDF ? (
                            <a href={getDropboxViewLink(url)} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center w-full h-full">
                              <FileText className="w-10 h-10 text-green-400 mb-1" />
                              <span className="text-xs text-green-700">View PDF</span>
                            </a>
                          ) : (
                            <a href={getDropboxViewLink(url)} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center w-full h-full">
                              <FileText className="w-10 h-10 text-green-400 mb-1" />
                              <span className="text-xs text-green-700">View File</span>
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2 mb-2">
                          <a href={getDropboxViewLink(url)} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-200">View</a>
                          <a href={getDropboxDownloadLink(url)} target="_blank" rel="noopener noreferrer" className="p-2 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-all duration-200" title="Download"><Download className="w-4 h-4" /></a>
                          <button className="p-2 text-emerald-700 hover:text-red-600 hover:bg-emerald-50 rounded-lg transition-all duration-200" onClick={() => handleDeleteDoc(field)} title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ) : (
                      <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-emerald-300 rounded-xl p-6 cursor-pointer hover:bg-emerald-50 transition-all duration-200">
                        <Upload className="w-8 h-8 text-emerald-400 mb-2" />
                        <span className="text-emerald-700 text-sm mb-2">Upload {MAIN_DOC_FIELDS[field]}</span>
                        <input type="file" accept=".pdf,image/*" className="hidden" onChange={e => { const file = e.target.files[0]; if (file) handleFileUpload(field, file); }} disabled={uploading} />
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            {/* Category Header */}
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-200 to-blue-300 rounded-xl flex items-center justify-center mr-3">
                <span className="text-lg">📝</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">Exam Related Documents (Optional)</h3>
                <p className="text-sm text-gray-600">Upload and manage your key documents. Only you control access.</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {uploadedCount} uploaded
              </span>
            </div>

            {/* Select Documents Section */}
            <div className="mb-6">
              <div className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                Select Documents
                <div className="relative inline-block">
                  <span
                    className="text-xs text-gray-400 cursor-help"
                    onMouseEnter={() => setShowSelectTooltip(true)}
                    onMouseLeave={() => setShowSelectTooltip(false)}
                    onFocus={() => setShowSelectTooltip(true)}
                    onBlur={() => setShowSelectTooltip(false)}
                    tabIndex={0}
                    aria-describedby="select-doc-tooltip"
                  >
                    ⓘ
                  </span>
                  {showSelectTooltip && (
                    <div
                      id="select-doc-tooltip"
                      className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap"
                      role="tooltip"
                    >
                      Choose a document type and upload a file.<br/>Accepted: JPG, PNG, PDF.
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <select className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white" value={formData.docType || ""} onChange={e => setFormData({ ...formData, docType: e.target.value })}>
                  <option value="">Select document type</option>
                  {MAIN_DROPDOWN_FIELDS.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
                </select>
                <label className={`flex items-center justify-center px-6 py-3 rounded-xl cursor-pointer transition-all duration-300 whitespace-nowrap ${formData.docType ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                  {uploading ? (<><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div><span className="font-medium">Uploading...</span></>) : (<><Upload className="w-4 h-4 mr-2" /><span className="font-medium">Upload File</span></>)}
                  <input type="file" accept=".pdf,image/*" className="hidden" onChange={e => { const file = e.target.files[0]; if (file && formData.docType) handleFileUpload(formData.docType, file); }} disabled={!formData.docType || uploading} />
                </label>
              </div>
              {/* Show preview of selected file before upload */}
              {formData.selectedFile && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-gray-500">Selected:</span>
                  <span className="text-xs font-medium text-blue-700">{formData.selectedFile.name}</span>
                </div>
              )}
              {/* Uploaded docs grid for dropdown docs, keep original grid style */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
                {MAIN_DROPDOWN_FIELDS.map(opt => {
                  const url = allDocuments[opt.key];
                  if (!url) return null;
                  const isImage = url && (url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".png"));
                  const isPDF = url && url.endsWith(".pdf");
                  return (
                    <div key={opt.key} className="rounded-xl border border-emerald-200 p-4 flex flex-col items-center hover:shadow-lg hover:scale-105 transition-all duration-300 group bg-emerald-50/30">
                      <div className="w-16 h-16 mb-2 flex items-center justify-center border border-emerald-200 rounded-xl overflow-hidden bg-emerald-50">
                        {isImage ? <img src={getDropboxViewLink(url)} alt={opt.label} className="object-contain w-full h-full" /> : isPDF ? <a href={getDropboxViewLink(url)} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center w-full h-full"><FileText className="w-8 h-8 text-emerald-400 mb-1" /><span className="text-xs text-emerald-700">View PDF</span></a> : <FileText className="w-8 h-8 text-emerald-400" />}
                      </div>
                      <div className="font-semibold text-gray-900 text-sm mb-2 text-center">{opt.label}</div>
                      <div className="flex gap-2">
                        <a href={getDropboxViewLink(url)} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-200">View</a>
                        <a href={getDropboxDownloadLink(url)} target="_blank" rel="noopener noreferrer" className="p-2 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-all duration-200" title="Download"><Download className="w-4 h-4" /></a>
                        <button className="p-2 text-emerald-700 hover:text-red-600 hover:bg-emerald-50 rounded-lg transition-all duration-200" onClick={() => handleDeleteDoc(opt.key)} title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Custom Documents Section */}
            <div className="mt-8">
              <div className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                Add Custom Documents (optional)
                <div className="relative inline-block">
                  <span
                    className="text-xs text-gray-400 cursor-help"
                    onMouseEnter={() => setShowCustomTooltip(true)}
                    onMouseLeave={() => setShowCustomTooltip(false)}
                    onFocus={() => setShowCustomTooltip(true)}
                    onBlur={() => setShowCustomTooltip(false)}
                    tabIndex={0}
                    aria-describedby="custom-doc-tooltip"
                  >
                    ⓘ
                  </span>
                  {showCustomTooltip && (
                    <div
                      id="custom-doc-tooltip"
                      className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap"
                      role="tooltip"
                    >
                      Give your document a custom name and upload.<br/>Accepted: JPG, PNG, PDF.
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <input type="text" className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white" placeholder="Custom document name" value={formData.customDocName || ""} onChange={e => setFormData({ ...formData, customDocName: e.target.value })} />
                <label className={`flex items-center justify-center px-6 py-3 rounded-xl cursor-pointer transition-all duration-300 whitespace-nowrap ${formData.customDocName ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                  {uploading ? (<><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div><span className="font-medium">Uploading...</span></>) : (<><Upload className="w-4 h-4 mr-2" /><span className="font-medium">Upload File</span></>)}
                  <input type="file" accept=".pdf,image/*" className="hidden" onChange={e => { const file = e.target.files[0]; if (file && formData.customDocName) handleFileUpload(formData.customDocName.toLowerCase().replace(/\s+/g, "_") + "_file_url", file); }} disabled={!formData.customDocName || uploading} />
                </label>
              </div>
              {/* Show preview of selected file before upload */}
              {formData.selectedCustomFile && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-gray-500">Selected:</span>
                  <span className="text-xs font-medium text-blue-700">{formData.selectedCustomFile.name}</span>
                </div>
              )}
              {/* Uploaded custom docs grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
                {Object.keys(allDocuments).filter(key => !MAIN_DOC_FIELDS[key]).map(key => {
                  const url = allDocuments[key];
                  if (!url) return null;
                  const isImage = url && (url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".png"));
                  const isPDF = url && url.endsWith(".pdf");
                  return (
                    <div key={key} className="rounded-xl border border-green-200 p-4 flex flex-col items-center hover:shadow-lg hover:scale-105 transition-all duration-300 group bg-green-50/30">
                      <div className="w-16 h-16 mb-2 flex items-center justify-center border border-green-200 rounded-xl overflow-hidden bg-green-50">
                        {isImage ? <img src={getDropboxViewLink(url)} alt={key} className="object-contain w-full h-full" /> : isPDF ? <a href={getDropboxViewLink(url)} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center w-full h-full"><FileText className="w-8 h-8 text-green-400 mb-1" /><span className="text-xs text-green-700">View PDF</span></a> : <FileText className="w-8 h-8 text-green-400" />}
                      </div>
                      <div className="font-semibold text-gray-900 text-sm mb-2 text-center">{prettifyFieldName(key)}</div>
                      <div className="flex gap-2">
                        <a href={getDropboxViewLink(url)} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200">View</a>
                        <a href={getDropboxDownloadLink(url)} target="_blank" rel="noopener noreferrer" className="p-2 text-green-700 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-200" title="Download"><Download className="w-4 h-4" /></a>
                        <button className="p-2 text-green-700 hover:text-red-600 hover:bg-green-50 rounded-lg transition-all duration-200" onClick={() => handleDeleteDoc(key)} title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Empty State - Enhanced */}
          {uploadedCount === 0 && (
            <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No documents uploaded yet</h3>
              <p className="text-gray-600 mb-6">Start by uploading your first document using the form above</p>
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                Secured & Encrypted Storage
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
