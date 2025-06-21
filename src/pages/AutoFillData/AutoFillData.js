import React, { useState, useEffect, useCallback } from 'react';
import Footer from '../../components/Footer/Footer';
import { User, Mail, ChevronRight, ChevronLeft, Check, Save, FileText } from 'lucide-react';
import { api } from '../../services/api';

const steps = [
  { name: 'Personal Details', icon: User },
  { name: 'Contact Information', icon: Mail }
];

const AutoFillDataForm = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('autoFillData');
    return saved ? JSON.parse(saved) : {};
  });
  const [autoFilledFields, setAutoFilledFields] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [completedFields, setCompletedFields] = useState(new Set());
  const [showCelebration, setShowCelebration] = useState(false);

  // Auto-fill form with available user data
  useEffect(() => {
    const autoFillFromUserData = () => {
      const currentUser = localStorage.getItem("currentUser");
      const googleData = localStorage.getItem("googleData");
      
      let filledFields = [];
      let updatedFormData = { ...formData };
      
      // Fill from Google data if available
      if (googleData) {
        try {
          const gData = JSON.parse(googleData);
          console.log('Auto-filling from Google data:', gData);
          
          if (gData.name && !updatedFormData.fullName) {
            updatedFormData.fullName = gData.name;
            filledFields.push('fullName');
          }
          if (gData.email && !updatedFormData.email) {
            updatedFormData.email = gData.email;
            filledFields.push('email');
          }
          if (gData.given_name && !updatedFormData.fathersName) {
            // If we have given_name and family_name, we can make some assumptions
            // This is a basic example - you might want to improve this logic
            if (gData.family_name && gData.name.includes(gData.family_name)) {
              // Could potentially derive some information, but let's keep it simple for now
            }
          }
          
        } catch (error) {
          console.error('Error parsing Google data:', error);
        }
      }
      
      // Fill from current user data if available
      if (currentUser) {
        try {
          const userData = JSON.parse(currentUser);
          console.log('Auto-filling from user data:', userData);
          
          // Map user data to form fields
          if (userData.fullName && !updatedFormData.fullName) {
            updatedFormData.fullName = userData.fullName;
            if (!filledFields.includes('fullName')) filledFields.push('fullName');
          }
          if (userData.email && !updatedFormData.email) {
            updatedFormData.email = userData.email;
            if (!filledFields.includes('email')) filledFields.push('email');
          }
          if (userData.dateofbirth && !updatedFormData.dob) {
            updatedFormData.dob = userData.dateofbirth;
            filledFields.push('dob');
          }
          if (userData.phone_number && !updatedFormData.mobile) {
            updatedFormData.mobile = userData.phone_number;
            filledFields.push('mobile');
          }
          if (userData.correspondenceAddress && !updatedFormData.correspondenceAddress) {
            updatedFormData.correspondenceAddress = userData.correspondenceAddress;
            filledFields.push('correspondenceAddress');
          }
          if (userData.permanentAddress && !updatedFormData.permanentAddress) {
            updatedFormData.permanentAddress = userData.permanentAddress;
            filledFields.push('permanentAddress');
          }
          if (userData.gender && !updatedFormData.gender) {
            updatedFormData.gender = userData.gender;
            filledFields.push('gender');
          }
          if (userData.category && !updatedFormData.category) {
            updatedFormData.category = userData.category;
            filledFields.push('category');
          }
          if (userData.fathersName && !updatedFormData.fathersName) {
            updatedFormData.fathersName = userData.fathersName;
            filledFields.push('fathersName');
          }
          if (userData.mothersName && !updatedFormData.mothersName) {
            updatedFormData.mothersName = userData.mothersName;
            filledFields.push('mothersName');
          }
          if (userData.nationality && !updatedFormData.nationality) {
            updatedFormData.nationality = userData.nationality;
            filledFields.push('nationality');
          }
          if (userData.domicileState && !updatedFormData.domicile) {
            updatedFormData.domicile = userData.domicileState;
            filledFields.push('domicile');
          }
          if (userData.maritalStatus && !updatedFormData.maritalStatus) {
            updatedFormData.maritalStatus = userData.maritalStatus;
            filledFields.push('maritalStatus');
          }
          if (userData.religion && !updatedFormData.religion) {
            updatedFormData.religion = userData.religion;
            filledFields.push('religion');
          }
          if (userData.alt_phone_number && !updatedFormData.altMobile) {
            updatedFormData.altMobile = userData.alt_phone_number;
            filledFields.push('altMobile');
          }
          if (userData.disability !== undefined && updatedFormData.disability === undefined) {
            updatedFormData.disability = userData.disability;
            filledFields.push('disability');
          }
          
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
      
      // Update state if any fields were filled
      if (filledFields.length > 0) {
        setFormData(updatedFormData);
        setAutoFilledFields(filledFields);
        
        // Show auto-fill notification
        const messageElement = document.createElement('div');
        messageElement.textContent = `Auto-filled ${filledFields.length} field(s) from your profile data`;
        messageElement.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-sm font-medium';
        document.body.appendChild(messageElement);
        setTimeout(() => {
          if (document.body.contains(messageElement)) {
            document.body.removeChild(messageElement);
          }
        }, 4000);
        
        console.log(`Auto-filled fields: ${filledFields.join(', ')}`);
      }
      
      // Clean up localStorage data after using it
      localStorage.removeItem("googleData");
    };
    
    // Only auto-fill on first load
    if (Object.keys(formData).length === 0) {
      autoFillFromUserData();
    }
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('autoFillData', JSON.stringify(formData));
  }, [formData]);

  const handleNext = async () => {
    // Auto-save before moving to next step
    await saveToBackend(false);
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  // const handleParsedTextChange = (filename, field, newValue) => {
  //   setFormData((prev) => {
  //   const currentRaw = prev.document_texts?.[filename] || '{}';
  //     let parsed;
  //     try {
  //       parsed = JSON.parse(currentRaw);
  //     } catch {
  //       parsed = {};
  //     }

  //     parsed[field] = newValue;

  //     return {
  //       ...prev,
  //       document_texts: {
  //         ...prev.document_texts,
  //         [filename]: JSON.stringify(parsed)
  //       }
  //     };
  //   });
  // };

  // const CollapsibleField = ({ data, path = [], onChange, filename, onAddField, onRemoveField }) => {
  //   const [isOpen, setIsOpen] = useState(true);

  //   const currentFieldName = typeof path[path.length - 1] === 'number'
  //     ? `Item ${path[path.length - 1] + 1}`
  //     : (path[path.length - 1] || 'Extracted file data').replace(/_/g, ' ').toUpperCase();

  //   if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
  //     return (
  //       <div style={{ marginLeft: '20px', marginBottom: '10px', borderLeft: '2px solid #ddd', paddingLeft: '10px' }}>
  //         <div
  //           style={{ cursor: 'pointer', fontWeight: 'bold', color: '#007BFF' }}
  //           onClick={() => setIsOpen(!isOpen)}
  //         >
  //           {currentFieldName} {isOpen ? '▼' : '▶'}
  //         </div>

  //         {isOpen && (
  //           <>
  //             {Object.entries(data).map(([key, val]) => (
  //               <CollapsibleField
  //                 key={key}
  //                 data={val}
  //                 path={[...path, key]}
  //                 filename={filename}
  //                 onChange={onChange}
  //                 // onAddField={onAddField}
  //                 onRemoveField={onRemoveField}
  //               />
  //             ))}
  //             <button onClick={() => onAddField(filename, path)} style={{ marginTop: '5px', fontSize: '0.9em', background: 'lightblue', color: 'black', border: 'none', padding: '4px 8px', borderRadius: '4px' }}>
  //               ➕ Add Field
  //             </button>
  //           </>
  //         )}
  //       </div>
  //     );
  //   } else if (Array.isArray(data)) {
  //     return (
  //       <div style={{ marginLeft: '20px' }}>
  //         <div
  //           style={{ cursor: 'pointer', fontWeight: 'bold', color: '#28a745' }}
  //           onClick={() => setIsOpen(!isOpen)}
  //         >
  //           {currentFieldName} {isOpen ? '▼' : '▶'}
  //         </div>
  //         {isOpen &&
  //           data.map((item, idx) => (
  //             <CollapsibleField
  //               key={idx}
  //               data={item}
  //               path={[...path, idx]}
  //               filename={filename}
  //               onChange={onChange}
  //               onAddField={onAddField}
  //               onRemoveField={onRemoveField}
  //             />
  //           ))}
  //       </div>
  //     );
  //   } else {
  //     return (
  //       <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
  //         <label style={{ flex: 1 }}>
  //           {currentFieldName}
  //           <input
  //             type="text"
  //             value={data}
  //             onChange={(e) => onChange(path, e.target.value)}
  //             style={{ width: '100%', marginTop: '4px' }}
  //           />
  //         </label>
  //         <button
  //           onClick={() => onRemoveField(filename, path)}
  //           style={{ marginLeft: '10px', background: 'white', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px' }}
  //         >
  //           ❌
  //         </button>
  //       </div>
  //     );
  //   }
  // };


  // const renderInputs = (data, onChange, path = []) => {
  //   if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
  //     return Object.entries(data).map(([key, val]) => (
  //       <div key={key} style={{ marginLeft: "20px", marginBottom: "10px" }}>
  //         <label style={{ display: 'block' }}>
  //           {key.replace(/_/g, ' ').toUpperCase()}
  //         </label>
  //         {renderInputs(val, onChange, [...path, key])}
  //       </div>
  //     ));
  //   } else if (Array.isArray(data)) {
  //     return data.map((val, idx) => (
  //       <div key={idx} style={{ marginLeft: "20px", marginBottom: "10px" }}>
  //         <label style={{ display: 'block' }}>
  //           Index {idx}
  //         </label>
  //         {renderInputs(val, onChange, [...path, idx])}
  //       </div>
  //     ));
  //   } else {
  //     const name = path.join('.');
  //     return (
  //       <input
  //         type="text"
  //         value={data}
  //         onChange={(e) => onChange(path, e.target.value)}
  //         style={{ width: '100%' }}
  //       />
  //     );
  //   }
  // };

  const calculateCompletionPercentage = (data) => {
    let total = 0;
    let filled = 0;

    // Recursive function to handle nested fields
    const traverse = (obj) => {
      for (const key in obj) {
        const value = obj[key];
        total++;
        if (
          value !== null &&
          value !== "" 
          && !(typeof value === "object" && Object.keys(value).length === 0 && key !== 'document_texts')
        ) {
          filled++;
        }
      }
    };

    // Call the traverse function on your formData
    traverse(formData);

    if (total === 0) return 0;
    return Math.round((filled / total) * 100);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    const previousValue = formData[name];
    const isNewlyCompleted = !previousValue && value && value.trim() !== '';
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Track field completion for visual feedback
    if (isNewlyCompleted) {
      setCompletedFields(prev => new Set([...prev, name]));
      
      // Show brief celebration effect
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 600);
      
      // Check if step is completed
      const stepFields = {
        0: ['fullName', 'fathersName', 'mothersName', 'gender', 'dob', 'category'],
        1: ['email', 'mobile', 'permanentAddress', 'correspondenceAddress']
      };
      
      const currentStepFields = stepFields[step] || [];
      const newFormData = { ...formData, [name]: value };
      const completedInStep = currentStepFields.filter(field => {
        const fieldValue = newFormData[field];
        return fieldValue && fieldValue.toString().trim() !== '';
      }).length;
      
      if (completedInStep === currentStepFields.length) {
        // Step completed - show success message
        const celebrationElement = document.createElement('div');
        celebrationElement.textContent = `🎉 ${steps[step].name} completed!`;
        celebrationElement.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-sm font-medium animate-bounce';
        document.body.appendChild(celebrationElement);
        setTimeout(() => {
          if (document.body.contains(celebrationElement)) {
            document.body.removeChild(celebrationElement);
          }
        }, 3000);
      }
    }
  };

  const getCompletionPercentage = () => {
    // Define required fields for each step
    const stepFields = {
      0: ['fullName', 'fathersName', 'mothersName', 'gender', 'dob', 'category'], // Personal Details
      1: ['email', 'mobile', 'permanentAddress', 'correspondenceAddress'] // Contact Information
    };
    
    // Calculate overall completion considering all steps
    let totalCompletion = 0;
    let totalPossibleFields = 0;
    
    Object.keys(stepFields).forEach(stepIndex => {
      const fields = stepFields[stepIndex];
      const completedInStep = fields.filter(field => {
        const value = formData[field];
        return value && value.toString().trim() !== '';
      }).length;
      
      if (parseInt(stepIndex) < step) {
        // Previous steps should be fully weighted
        totalCompletion += completedInStep;
      } else if (parseInt(stepIndex) === step) {
        // Current step gets partial weight
        totalCompletion += completedInStep;
      }
      totalPossibleFields += fields.length;
    });
    
    return totalPossibleFields > 0 ? Math.round((totalCompletion / totalPossibleFields) * 100) : 0;
  };

  // Helper function to get field styling based on completion status
  const getFieldClassName = (fieldName) => {
    const baseClass = "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
    
    if (autoFilledFields.includes(fieldName)) {
      return `${baseClass} border-green-200 bg-green-50`;
    } else if (completedFields.has(fieldName) || (formData[fieldName] && formData[fieldName].toString().trim() !== '')) {
      return `${baseClass} border-blue-300 bg-blue-50/50 shadow-sm`;
    } else {
      return `${baseClass} border-gray-200 hover:border-gray-300`;
    }
  };

  // Save data to backend
  const saveToBackend = useCallback(async (showNotification = true) => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Map frontend field names to backend field names for consistency
      const backendData = {
        ...formData,
        fullName: formData.fullName,
        fathersName: formData.fathersName,
        mothersName: formData.mothersName,
        dateofbirth: formData.dob,
        phone_number: formData.mobile,
        alt_phone_number: formData.altMobile,
        correspondenceAddress: formData.correspondenceAddress,
        permanentAddress: formData.permanentAddress,
        domicileState: formData.domicile,
        gender: formData.gender,
        category: formData.category,
        nationality: formData.nationality,
        maritalStatus: formData.maritalStatus,
        religion: formData.religion,
        disability: formData.disability
      };

      // Remove undefined fields and frontend-specific fields
      Object.keys(backendData).forEach(key => {
        if (backendData[key] === undefined || backendData[key] === '' || 
            ['dob', 'mobile', 'altMobile', 'domicile'].includes(key)) {
          delete backendData[key];
        }
      });

      console.log('Saving to backend:', backendData);
      
      const response = await api.update(backendData);
      
      if (response.success || response.user_data) {
        // Update localStorage with current data
        localStorage.setItem('autoFillData', JSON.stringify(formData));
        
        // Update current user in localStorage
        if (response.user_data) {
          localStorage.setItem("currentUser", JSON.stringify(response.user_data));
        }
        
        if (showNotification) {
          setSaveMessage('Data saved successfully to your profile!');
          setTimeout(() => setSaveMessage(''), 3000);
        }
        
        return { success: true };
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('Error saving to backend:', error);
      if (showNotification) {
        setSaveMessage('Failed to save to backend. Data saved locally.');
        setTimeout(() => setSaveMessage(''), 3000);
      }
      
      // Still save to localStorage as fallback
      localStorage.setItem('autoFillData', JSON.stringify(formData));
      return { success: false, error: error.message };
    } finally {
      setIsSaving(false);
    }
  }, [formData]);

  // Auto-save to backend every 30 seconds when there are changes
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (Object.keys(formData).length > 0) {
        saveToBackend(false); // Silent save without notifications
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [formData, saveToBackend]);

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name (As per Aadhaar) *
                  {autoFilledFields.includes('fullName') && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Auto-filled
                    </span>
                  )}
                </label>
                <input 
                  name="fullName" 
                  onChange={handleChange} 
                  value={formData.fullName || ''} 
                  required 
                  className={getFieldClassName('fullName')}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Father's Name (As per Aadhaar) *
                  {autoFilledFields.includes('fathersName') && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Auto-filled
                    </span>
                  )}
                </label>
                <input 
                  name="fathersName" 
                  onChange={handleChange} 
                  value={formData.fathersName || ''} 
                  required 
                  className={getFieldClassName('fathersName')}
                  placeholder="Enter father's name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mother's Name (As per Aadhaar) *
                  {autoFilledFields.includes('mothersName') && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Auto-filled
                    </span>
                  )}
                </label>
                <input 
                  name="mothersName" 
                  onChange={handleChange} 
                  value={formData.mothersName || ''} 
                  required 
                  className={getFieldClassName('mothersName')}
                  placeholder="Enter mother's name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                  {autoFilledFields.includes('gender') && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Auto-filled
                    </span>
                  )}
                </label>
                <select 
                  name="gender" 
                  onChange={handleChange} 
                  value={formData.gender || ''}
                  className={getFieldClassName('gender')}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth
                  {autoFilledFields.includes('dob') && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Auto-filled
                    </span>
                  )}
                </label>
                <input 
                  type="date" 
                  name="dob" 
                  onChange={handleChange} 
                  value={formData.dob || ''} 
                  className={getFieldClassName('dob')}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select 
                  name="category" 
                  onChange={handleChange} 
                  value={formData.category || ''}
                  className={getFieldClassName('category')}
                >
                  <option value="">Select Category</option>
                  <option value="GEN">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Disability Status</label>
                <select 
                  name="disability" 
                  onChange={(e) => {
                    const { name, value } = e.target;
                    // Convert string values to boolean for backend compatibility
                    const boolValue = value === "Yes" ? true : value === "No" ? false : '';
                    setFormData((prev) => ({ ...prev, [name]: boolValue }));
                  }}
                  value={formData.disability === true ? "Yes" : formData.disability === false ? "No" : ''}
                  className={getFieldClassName('disability')}
                >
                  <option value="">Select Status</option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nationality</label>
                <input 
                  name="nationality" 
                  onChange={handleChange} 
                  value={formData.nationality || ''} 
                  className={getFieldClassName('nationality')}
                  placeholder="Enter nationality"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Domicile State</label>
                <input 
                  name="domicile" 
                  onChange={handleChange} 
                  value={formData.domicile || ''} 
                  className={getFieldClassName('domicile')}
                  placeholder="Enter domicile state"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                <select 
                  name="maritalStatus" 
                  onChange={handleChange} 
                  value={formData.maritalStatus || ''}
                  className={getFieldClassName('maritalStatus')}
                >
                  <option value="">Select Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Religion</label>
                <input 
                  name="religion" 
                  onChange={handleChange} 
                  value={formData.religion || ''} 
                  className={getFieldClassName('religion')}
                  placeholder="Enter religion"
                />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Permanent Address
                  {autoFilledFields.includes('permanentAddress') && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Auto-filled
                    </span>
                  )}
                </label>
                <textarea 
                  name="permanentAddress" 
                  onChange={handleChange} 
                  value={formData.permanentAddress || ''} 
                  rows={3}
                  className={getFieldClassName('permanentAddress')}
                  placeholder="Enter permanent address"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Correspondence Address
                  {autoFilledFields.includes('correspondenceAddress') && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Auto-filled
                    </span>
                  )}
                </label>
                <textarea 
                  name="correspondenceAddress" 
                  onChange={handleChange} 
                  value={formData.correspondenceAddress || ''} 
                  rows={3}
                  className={getFieldClassName('correspondenceAddress')}
                  placeholder="Enter correspondence address"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email ID
                  {autoFilledFields.includes('email') && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Auto-filled
                    </span>
                  )}
                </label>
                <input 
                  name="email" 
                  type="email" 
                  onChange={handleChange} 
                  value={formData.email || ''} 
                  className={getFieldClassName('email')}
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mobile Number
                  {autoFilledFields.includes('mobile') && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Auto-filled
                    </span>
                  )}
                </label>
                <input 
                  name="mobile" 
                  type="tel" 
                  onChange={handleChange} 
                  value={formData.mobile || ''} 
                  className={getFieldClassName('mobile')}
                  placeholder="Enter mobile number"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Alternate Mobile Number
                  {autoFilledFields.includes('altMobile') && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Auto-filled
                    </span>
                  )}
                </label>
                <input 
                  name="altMobile" 
                  type="tel" 
                  onChange={handleChange} 
                  value={formData.altMobile || ''} 
                  className={getFieldClassName('altMobile')}
                  placeholder="Enter alternate mobile number"
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const completion = calculateCompletionPercentage(formData);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 -left-32 w-64 h-64 bg-blue-50 rounded-full opacity-30"></div>
        <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-blue-200 rounded-full opacity-15 animate-pulse delay-1000"></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-blue-300 rounded-full opacity-30 animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-50"></div>
        
        {/* Celebration confetti when progress is made */}
        {showCelebration && (
          <div className="fixed inset-0 pointer-events-none z-40">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${0.8 + Math.random() * 0.4}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-semibold text-blue-700 mb-6">
            <FileText className="w-4 h-4 mr-2" />
            Auto-Fill Data Setup
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Complete Your <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Profile</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Set up your auto-fill data once and save hours on future applications
          </p>
        </div>

        {/* Progress Section */}
        <div className="mb-12">
          {/* Save Message Notification */}
          {saveMessage && (
            <div className={`mb-4 p-4 rounded-lg text-center font-medium transition-all duration-300 ${
              saveMessage.includes('Failed') 
                ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' 
                : saveMessage.includes('completed successfully') || saveMessage.includes('Profile completed')
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200 shadow-md'
                  : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              <div className="flex items-center justify-center">
                {saveMessage.includes('completed successfully') && (
                  <div className="w-6 h-6 mr-2 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <span className="text-sm lg:text-base">{saveMessage}</span>
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Overall Progress</span>
                <span>{getCompletionPercentage()}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-700 ease-out relative"
                  style={{ width: `${getCompletionPercentage()}%` }}
                >
                  {/* Animated shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-8">
              {steps.map((stepItem, index) => {
                const StepIcon = stepItem.icon;
                const isCompleted = index < step;
                const isCurrent = index === step;
                
                // Calculate completion for step indicator
                const stepFields = {
                  0: ['fullName', 'fathersName', 'mothersName', 'gender', 'dob', 'category'],
                  1: ['email', 'mobile', 'permanentAddress', 'correspondenceAddress']
                };
                
                const currentFields = stepFields[index] || [];
                const filledInStep = currentFields.filter(field => {
                  const value = formData[field];
                  return value && value.toString().trim() !== '';
                }).length;
                
                const stepCompletion = currentFields.length > 0 
                  ? (filledInStep / currentFields.length) * 100 
                  : 0;
                
                const isPartiallyComplete = stepCompletion > 0 && stepCompletion < 100;
                
                return (
                  <div key={index} className="flex items-center">
                    <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : isCurrent 
                          ? isPartiallyComplete
                            ? 'bg-blue-100 border-blue-500 text-blue-600'
                            : 'bg-blue-500 border-blue-500 text-white'
                          : 'bg-gray-100 border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : isCurrent && isPartiallyComplete ? (
                        <>
                          <StepIcon className="w-5 h-5" />
                          {/* Progress ring for current step */}
                          <div className="absolute inset-0 rounded-full border-2 border-transparent">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-blue-200"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className="text-blue-500"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={`${stepCompletion}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                style={{
                                  transition: 'stroke-dasharray 0.5s ease-out'
                                }}
                              />
                            </svg>
                          </div>
                        </>
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div className={`ml-3 ${index < steps.length - 1 ? 'mr-8' : ''}`}>
                      <p className={`text-sm font-medium transition-colors duration-200 ${
                        isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        Step {index + 1}
                        {isCurrent && isPartiallyComplete && (
                          <span className="ml-1 text-xs">({Math.round(stepCompletion)}%)</span>
                        )}
                      </p>
                      <p className={`text-xs transition-colors duration-200 ${
                        isCurrent ? 'text-blue-500' : isCompleted ? 'text-green-500' : 'text-gray-400'
                      }`}>
                        {stepItem.name}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${
                        index < step ? 'bg-green-400' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Current Step Title */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{steps[step].name}</h2>
              <p className="text-gray-600">
                {step === 0 && "Please provide your personal information as it appears on official documents."}
                {step === 1 && "Enter your contact details and address information."}
              </p>
            </div>

            {/* Form Content */}
            <div className="mb-8">
              {renderStep()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div>
                {step > 0 && (
                  <button 
                    onClick={handleBack}
                    className="flex items-center px-6 py-3 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={saveToBackend}
                  disabled={isSaving}
                  className="flex items-center px-6 py-3 text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Progress
                    </>
                  )}
                </button>

                {step < steps.length - 1 ? (
                  <button 
                    onClick={handleNext}
                    className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg font-medium"
                  >
                    Next Step
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button 
                    onClick={async () => {
                      const result = await saveToBackend(false);
                      
                      // Show celebration effect
                      setShowCelebration(true);
                      setTimeout(() => setShowCelebration(false), 2000);
                      
                      if (result.success) {
                        setSaveMessage('🎉 Profile completed successfully! Your data is now saved and ready for auto-filling applications.');
                      } else {
                        setSaveMessage('✅ Profile completed! Data saved locally. Please check your internet connection to sync with server.');
                      }
                      setTimeout(() => setSaveMessage(''), 5000);
                    }}
                    disabled={isSaving}
                    className="flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Complete Setup
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AutoFillDataForm;
