import React, { useState, useEffect, useCallback } from 'react';
import Footer from '../../components/Footer/Footer';
import { User, Mail, ChevronRight, ChevronLeft, Check, Save } from 'lucide-react';
import { api } from '../../services/api';
import { LoadingProgressBar } from '../../components/ProgressBar';

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
          
          // Map user data to form fields with comprehensive field mapping
          const fieldMappings = [
            { userField: 'fullName', formField: 'fullName' },
            { userField: 'email', formField: 'email' },
            { userField: 'dateofbirth', formField: 'dob' },
            { userField: 'phone_number', formField: 'mobile' },
            { userField: 'correspondenceAddress', formField: 'correspondenceAddress' },
            { userField: 'permanentAddress', formField: 'permanentAddress' },
            { userField: 'gender', formField: 'gender' },
            { userField: 'category', formField: 'category' },
            { userField: 'fathersName', formField: 'fathersName' },
            { userField: 'mothersName', formField: 'mothersName' },
            { userField: 'nationality', formField: 'nationality' },
            { userField: 'domicileState', formField: 'domicile' },
            { userField: 'domicile', formField: 'domicile' }, // Alternative mapping
            { userField: 'district', formField: 'district' },
            { userField: 'mandal', formField: 'mandal' },
            { userField: 'pincode', formField: 'pincode' },
            { userField: 'maritalStatus', formField: 'maritalStatus' },
            { userField: 'religion', formField: 'religion' },
            { userField: 'alt_phone_number', formField: 'altMobile' },
            { userField: 'disability', formField: 'disability' }
          ];

          // Define valid options for dropdown fields
          const validDropdownOptions = {
            gender: ['Male', 'Female', 'Other'],
            category: ['GEN', 'OBC', 'SC', 'ST', 'EWS'],
            maritalStatus: ['Single', 'Married', 'Divorced', 'Widowed', 'Others']
          };

          fieldMappings.forEach(({ userField, formField }) => {
            const userValue = userData[userField];
            const currentFormValue = updatedFormData[formField];
            
            // Only fill if user has data and form field is empty
            if (userValue !== undefined && userValue !== null && userValue !== '' && 
                (currentFormValue === undefined || currentFormValue === null || currentFormValue === '')) {
              
              // For dropdown fields, validate that the value is in the valid options
              if (validDropdownOptions[formField]) {
                if (validDropdownOptions[formField].includes(userValue)) {
                  updatedFormData[formField] = userValue;
                  
                  if (!filledFields.includes(formField)) {
                    filledFields.push(formField);
                  }
                  
                  console.log(`✅ Auto-filled ${formField} with valid dropdown value:`, userValue);
                } else {
                  console.log(`⚠️ Skipped auto-fill for ${formField}: "${userValue}" is not a valid option. Valid options:`, validDropdownOptions[formField]);
                }
              } else {
                // For non-dropdown fields, fill as usual
                updatedFormData[formField] = userValue;
                
                if (!filledFields.includes(formField)) {
                  filledFields.push(formField);
                }
                
                console.log(`✅ Auto-filled ${formField} with value:`, userValue);
              }
            }
          });
          
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
      
      // Update state if any fields were filled
      if (filledFields.length > 0) {
        setFormData(updatedFormData);
        
        // Show auto-fill notification with beautiful styling
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `
          <div class="flex items-center">
            <div class="w-8 h-8 mr-3 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-white font-medium text-sm">Auto-Fill Complete!</p>
              <p class="text-green-100 text-xs">Filled ${filledFields.length} field(s) from your profile data</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-3 text-green-200 hover:text-white transition-colors">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        `;
        messageElement.className = 'fixed top-6 right-6 z-50 max-w-sm p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl shadow-2xl border border-green-400/20 backdrop-blur-sm transform transition-all duration-300 animate-in slide-in-from-top-2';
        document.body.appendChild(messageElement);
        setTimeout(() => {
          if (document.body.contains(messageElement)) {
            messageElement.style.transform = 'translateY(-100%) scale(0.9)';
            messageElement.style.opacity = '0';
            setTimeout(() => {
              if (document.body.contains(messageElement)) {
                document.body.removeChild(messageElement);
              }
            }, 300);
          }
        }, 4000);
        
        console.log(`✅ Auto-filled fields: ${filledFields.join(', ')}`);
        console.log('📋 Updated form data:', updatedFormData);
      } else {
        console.log('ℹ️ No fields auto-filled. Available user data:', currentUser ? JSON.parse(currentUser) : 'None');
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

  // ...existing code...

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special validation for pincode - only allow 6 digits
    if (name === 'pincode') {
      // Only allow numeric input and limit to 6 characters
      if (value && (!/^\d*$/.test(value) || value.length > 6)) {
        return; // Don't update state if invalid
      }
    }
    
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
        0: ['fullName', 'fathersName', 'mothersName', 'gender', 'dob', 'category', 
            'disability', 'nationality', 'domicile', 'district', 'mandal', 'pincode', 'maritalStatus', 'religion'],
        1: ['permanentAddress', 'correspondenceAddress', 'email', 'mobile', 'altMobile']
      };
      
      const currentStepFields = stepFields[step] || [];
      const newFormData = { ...formData, [name]: value };
      const completedInStep = currentStepFields.filter(field => {
        const fieldValue = newFormData[field];
        return fieldValue !== undefined && fieldValue !== null && fieldValue !== '' && 
               (typeof fieldValue === 'boolean' || fieldValue.toString().trim() !== '');
      }).length;
      
      if (completedInStep === currentStepFields.length) {
        // Step completed - show beautiful success message
        const celebrationElement = document.createElement('div');
        celebrationElement.innerHTML = `
          <div class="flex items-center">
            <div class="w-8 h-8 mr-3 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-white font-medium text-sm">🎉 Step Complete!</p>
              <p class="text-blue-100 text-xs">${steps[step].name} has been completed</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-3 text-blue-200 hover:text-white transition-colors">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        `;
        celebrationElement.className = 'fixed top-6 right-6 z-50 max-w-sm p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-2xl border border-blue-400/20 backdrop-blur-sm transform transition-all duration-300 animate-in slide-in-from-top-2';
        document.body.appendChild(celebrationElement);
        setTimeout(() => {
          if (document.body.contains(celebrationElement)) {
            celebrationElement.style.transform = 'translateY(-100%) scale(0.9)';
            celebrationElement.style.opacity = '0';
            setTimeout(() => {
              if (document.body.contains(celebrationElement)) {
                document.body.removeChild(celebrationElement);
              }
            }, 300);
          }
        }, 3000);
      }
    }
  };

  const getCompletionPercentage = () => {
    // Define all form fields organized by step (as they appear in the actual form)
    const allFormFields = {
      0: [ // Personal Details step
        'fullName', 'fathersName', 'mothersName', 'gender', 'dob', 'category',
        'disability', 'nationality', 'domicile', 'district', 'mandal', 'pincode', 'maritalStatus', 'religion'
      ],
      1: [ // Contact Information step
        'permanentAddress', 'correspondenceAddress', 'email', 'mobile', 'altMobile'
      ]
    };
    
    // Define valid options for dropdown fields (same as auto-fill validation)
    const validDropdownOptions = {
      gender: ['Male', 'Female', 'Other'],
      category: ['GEN', 'OBC', 'SC', 'ST', 'EWS'],
      maritalStatus: ['Single', 'Married', 'Divorced', 'Widowed', 'Others']
    };
    
    // Helper function to check if a field has a valid value
    const hasValidValue = (value, fieldName) => {
      if (value === undefined || value === null || value === '') {
        return false;
      }
      
      // For dropdown fields, validate against valid options
      if (validDropdownOptions[fieldName]) {
        return validDropdownOptions[fieldName].includes(value);
      }
      
      // Handle boolean values properly (false is a valid value)
      if (typeof value === 'boolean') {
        return true;
      }
      // Handle string values
      if (typeof value === 'string') {
        return value.trim() !== '';
      }
      // Handle numbers
      if (typeof value === 'number') {
        return true;
      }
      return false;
    };
    
    // Calculate completion across all steps
    let totalCompleted = 0;
    let totalFields = 0;
    const completedFields = [];
    const emptyFields = [];
    
    Object.values(allFormFields).forEach(stepFields => {
      stepFields.forEach(field => {
        totalFields++;
        const value = formData[field];
        if (hasValidValue(value, field)) {
          totalCompleted++;
          completedFields.push(field);
        } else {
          emptyFields.push(field);
        }
      });
    });
    
    const percentage = totalFields > 0 ? Math.round((totalCompleted / totalFields) * 100) : 0;
    
    // Debug logging
    console.log('📊 Progress Calculation:', {
      totalFields,
      totalCompleted,
      percentage: `${percentage}%`,
      completedFields,
      emptyFields,
      formData: Object.keys(formData).reduce((acc, key) => {
        acc[key] = `${typeof formData[key]}: ${formData[key]}`;
        return acc;
      }, {})
    });
    
    return percentage;
  };

  // Helper function to get field styling based on completion status
  const getFieldClassName = (fieldName) => {
    const baseClass = "w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
    
    // Define valid options for dropdown fields (same as progress calculation)
    const validDropdownOptions = {
      gender: ['Male', 'Female', 'Other'],
      category: ['GEN', 'OBC', 'SC', 'ST', 'EWS'],
      maritalStatus: ['Single', 'Married', 'Divorced', 'Widowed', 'Others']
    };
    
    // Helper function to check if field has valid value
    const hasValidValue = (value, fieldName) => {
      if (value === undefined || value === null || value === '') {
        return false;
      }
      
      // For dropdown fields, validate against valid options
      if (validDropdownOptions[fieldName]) {
        return validDropdownOptions[fieldName].includes(value);
      }
      
      // Handle boolean values properly (false is a valid value)
      if (typeof value === 'boolean') {
        return true;
      }
      // Handle string values
      if (typeof value === 'string') {
        return value.trim() !== '';
      }
      // Handle numbers
      if (typeof value === 'number') {
        return true;
      }
      return false;
    };
    
    // Removed auto-filled field styling condition to eliminate green background
    if (completedFields.has(fieldName) || hasValidValue(formData[fieldName], fieldName)) {
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
        district: formData.district,
        mandal: formData.mandal,
        pincode: formData.pincode,
        gender: formData.gender,
        category: formData.category,
        nationality: formData.nationality,
        maritalStatus: formData.maritalStatus,
        religion: formData.religion,
        disability: formData.disability
      };

      // Get user authentication info
      const currentUser = localStorage.getItem("currentUser");
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      const userData = JSON.parse(currentUser);
      if (!userData.email) {
        throw new Error('User email not found');
      }
      
      // Add email to backend data
      backendData.email = userData.email;
      
      // Remove undefined fields and handle empty values properly
      Object.keys(backendData).forEach(key => {
        if (backendData[key] === undefined || 
            ['dob', 'mobile', 'altMobile', 'domicile'].includes(key)) {
          delete backendData[key];
        } else if (backendData[key] === '') {
          // Send empty strings as null to properly clear fields in backend
          backendData[key] = null;
        }
      });

      // Special handling for phone number fields - they must be valid or null
      if (backendData.phone_number && (backendData.phone_number.length !== 10 || !/^\d{10}$/.test(backendData.phone_number))) {
        backendData.phone_number = null;
      }
      if (backendData.alt_phone_number && (backendData.alt_phone_number.length !== 10 || !/^\d{10}$/.test(backendData.alt_phone_number))) {
        backendData.alt_phone_number = null;
      }

      // Special handling for pincode - must be 6 digits or null
      if (backendData.pincode && (backendData.pincode.length !== 6 || !/^\d{6}$/.test(backendData.pincode))) {
        backendData.pincode = null;
      }

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
        throw new Error(`Profile update failed. Response: ${JSON.stringify(response)}`);
      }
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      
      if (showNotification) {
        setSaveMessage(`Failed to save to backend: ${error.message}. Data saved locally.`);
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
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name (As per Aadhaar) *
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
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Father's Name (As per Aadhaar) *
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
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Mother's Name (As per Aadhaar) *
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
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Gender
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
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input 
                  type="date" 
                  name="dob" 
                  onChange={handleChange} 
                  value={formData.dob || ''} 
                  className={getFieldClassName('dob')}
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
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
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Disability Status
                </label>
                <select 
                  name="disability" 
                  onChange={(e) => {
                    const { name, value } = e.target;
                    // Convert string values to boolean for backend compatibility
                    const boolValue = value === "Yes" ? true : value === "No" ? false : '';
                    
                    // Track previous value for completion detection
                    const previousValue = formData[name];
                    const isNewlyCompleted = (previousValue === undefined || previousValue === null || previousValue === '') && boolValue !== '';
                    
                    setFormData((prev) => ({ ...prev, [name]: boolValue }));
                    
                    // Track field completion for visual feedback
                    if (isNewlyCompleted) {
                      setCompletedFields(prev => new Set([...prev, name]));
                      
                      // Show brief celebration effect
                      setShowCelebration(true);
                      setTimeout(() => setShowCelebration(false), 600);
                    }
                  }}
                  value={formData.disability === true ? "Yes" : formData.disability === false ? "No" : ''}
                  className={getFieldClassName('disability')}
                >
                  <option value="">Select Status</option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Nationality
                </label>
                <input 
                  name="nationality" 
                  onChange={handleChange} 
                  value={formData.nationality || ''} 
                  className={getFieldClassName('nationality')}
                  placeholder="Enter nationality"
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Domicile State
                </label>
                <input 
                  name="domicile" 
                  onChange={handleChange} 
                  value={formData.domicile || ''} 
                  className={getFieldClassName('domicile')}
                  placeholder="Enter domicile state"
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  District
                </label>
                <input 
                  name="district" 
                  onChange={handleChange} 
                  value={formData.district || ''} 
                  className={getFieldClassName('district')}
                  placeholder="Enter district"
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Mandal
                </label>
                <input 
                  name="mandal" 
                  onChange={handleChange} 
                  value={formData.mandal || ''} 
                  className={getFieldClassName('mandal')}
                  placeholder="Enter mandal"
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Pincode
                </label>
                <input 
                  name="pincode" 
                  type="text"
                  onChange={handleChange} 
                  value={formData.pincode || ''} 
                  className={getFieldClassName('pincode')}
                  placeholder="Enter 6-digit pincode"
                  pattern="[0-9]{6}"
                  maxLength="6"
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Marital Status
                </label>
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
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Religion
                </label>
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
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Permanent Address
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
              
              <div className="space-y-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Correspondence Address
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
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Email ID
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
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Mobile Number
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
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Alternate Mobile Number
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

  const completion = getCompletionPercentage();

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
        <div className="mb-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Complete Your <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Profile</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Set up your auto-fill data once and save hours on future applications
          </p>
        </div>

        {/* Form Content Container */}
        <div className="mb-1">
          <div className="bg-white rounded-2xl pl-5 pr-5 pb-5 pt-5 border border-gray-100 shadow-sm">
            {/* Progress Bar */}
            <div className="mb-0">
              
              <LoadingProgressBar 
                percentage={completion}
                showPercentage={false}
                size="normal"
                fillColor="bg-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {completion === 0 ? 'Start filling your profile details...' : 
                 completion < 25 ? 'Just getting started...' : 
                 completion < 50 ? 'Making good progress!' : 
                 completion < 75 ? 'More than halfway there!' : 
                 completion < 100 ? 'Almost complete!' : 
                 'Profile completed! 🎉'}
              </p>
            </div>

            {/* Form Title */}
            <div className="-ml-10">
              <h2 className="text-xl font-bold text-gray-900 ">Profile Information</h2>
            </div>

            {/* Form Content */}
            <div className="mb-5">
              {renderStep()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
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
                        setSaveMessage('Profile completed successfully!');
                      } else {
                        setSaveMessage('Profile completed! Data saved locally.');
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

      {/* Beautiful Toast Notification Popup */}
      {saveMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className={`max-w-sm p-4 rounded-2xl shadow-2xl border backdrop-blur-sm transform transition-all duration-300 ${
            saveMessage.includes('Failed') 
              ? 'bg-gradient-to-r from-yellow-500/95 to-orange-500/95 text-white border-yellow-400/20' 
              : saveMessage.includes('completed successfully') || saveMessage.includes('Profile completed')
                ? 'bg-gradient-to-r from-green-500/95 to-emerald-500/95 text-white border-green-400/20'
                : 'bg-gradient-to-r from-blue-500/95 to-blue-600/95 text-white border-blue-400/20'
          }`}>
            <div className="flex items-center">
              {saveMessage.includes('completed successfully') && (
                <div className="w-8 h-8 mr-3 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              )}
              {saveMessage.includes('Failed') ? (
                <div className="w-8 h-8 mr-3 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : !saveMessage.includes('completed successfully') && (
                <div className="w-8 h-8 mr-3 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-sm leading-relaxed">{saveMessage}</p>
                {saveMessage.includes('completed successfully') && (
                  <p className="text-xs text-green-100 mt-1">Ready for auto-filling applications!</p>
                )}
                {saveMessage.includes('Data saved locally') && (
                  <p className="text-xs text-green-100 mt-1">Check internet connection to sync</p>
                )}
                {saveMessage === 'Data saved successfully to your profile!' && (
                  <p className="text-xs text-blue-100 mt-1">Progress automatically saved</p>
                )}
              </div>
              <button 
                onClick={() => setSaveMessage('')}
                className={`ml-3 transition-colors ${
                  saveMessage.includes('Failed') 
                    ? 'text-yellow-200 hover:text-white'
                    : saveMessage.includes('completed successfully') || saveMessage.includes('Profile completed')
                      ? 'text-green-200 hover:text-white'
                      : 'text-blue-200 hover:text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoFillDataForm;
