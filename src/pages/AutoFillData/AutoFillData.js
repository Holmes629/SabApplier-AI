import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Footer from '../../components/Footer/Footer';
import './AutoFillData.css';

const steps = [
  'Personal Details',
  'Contact Information',
  // 'Details Extracted from Documents',
];

const stepPercentages = [30, 60, 100];

const AutoFillDataForm = () => {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({});
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isProfileFetched, setIsProfileFetched] = useState(
    localStorage.getItem("isProfileFetched") === "true"
  );

  useEffect(() => {
    if (!isProfileFetched) {
      getProfile();
    } else if (!userData || Object.keys(userData).length === 0) {
      const savedUser = localStorage.getItem("currentUser");
      const savedFormData = localStorage.getItem("formData");

      if (savedUser) {
        const user = JSON.parse(savedUser);
        setUserData(user);
      }

      if (savedFormData) {
        setFormData(JSON.parse(savedFormData));
      } else if (savedUser) {
        setFormData(JSON.parse(savedUser));
      }
    }
  }, [userData]);

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


  // const handleAddField = (filename, path) => {
  //   const key = prompt("Enter the new field name:");
  //   if (!key) return;

  //   setFormData((prev) => {
  //     const currentRaw = prev.document_texts?.[filename] || '{}';
  //     let parsed = {};
  //     try {
  //       parsed = JSON.parse(currentRaw);
  //     } catch {
  //       parsed = {};
  //     }

  //     let ref = parsed;
  //     for (let i = 0; i < path.length; i++) {
  //       const part = path[i];
  //       if (typeof ref[part] !== 'object') ref[part] = {};
  //       ref = ref[part];
  //     }

  //     ref[key] = "";

  //     return {
  //       ...prev,
  //       document_texts: {
  //         ...prev.document_texts,
  //         [filename]: JSON.stringify(parsed),
  //       },
  //     };
  //   });
  // };

  // const handleRemoveField = (filename, path) => {
  //   setFormData((prev) => {
  //     const currentRaw = prev.document_texts?.[filename] || '{}';
  //     let parsed = {};
  //     try {
  //       parsed = JSON.parse(currentRaw);
  //     } catch {
  //       parsed = {};
  //     }

  //     let ref = parsed;
  //     for (let i = 0; i < path.length - 1; i++) {
  //       ref = ref[path[i]];
  //     }

  //     delete ref[path[path.length - 1]];

  //     return {
  //       ...prev,
  //       document_texts: {
  //         ...prev.document_texts,
  //         [filename]: JSON.stringify(parsed),
  //       },
  //     };
  //   });
  // };


  const handleNext = () => {
    // Save current formData to localStorage
    localStorage.setItem("formData", JSON.stringify(formData));
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    localStorage.setItem("formData", JSON.stringify(formData));
    e.preventDefault();
    setLoading(true);
    formData.document_texts = JSON.stringify(formData.document_texts);
    setError('');
    try {
      const result = await api.update(formData);
      window.location.reload();
      if (result.success) {
        // navigate('/manage-docs');
      } else {
        setError(result.message || 'Profile update failed.');
      }
    } catch (err) {
      console.log(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="form-step">
            {/* Personal Details */}
            <label>Full Name (As per Aadhaar) <input name="fullName" onChange={handleChange} value={formData.fullName || ''} required /></label>
            <label>Father's Name (As per Aadhaar) <input name="fathersName" onChange={handleChange} value={formData.fathersName || ''} required /></label>
            <label>Mother's Name (As per Aadhaar) <input name="mothersName" onChange={handleChange} value={formData.mothersName || ''} required /></label>
            <label>Gender 
              <select name="gender" onChange={handleChange} value={formData.gender || ''}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </label>
            <label>Date of Birth <input type="date" name="dateofbirth" onChange={handleChange} value={formData.dateofbirth || ''} /></label>
            <label>Category 
              <select name="category" onChange={handleChange} value={formData.category || ''}>
                <option>GEN</option>
                <option>OBC</option>
                <option>SC</option>
                <option>ST</option>
                <option>EWS</option>
              </select>
            </label>
            <label>Disability Status 
              <select name="disability" onChange={handleChange} value={formData.disability || ''}>
                <option>Yes</option>
                <option>No</option>
              </select>
            </label>
            <label>Nationality <input name="nationality" onChange={handleChange} value={formData.nationality || ''} /></label>
            <label>Domicile State <input name="domicileState" onChange={handleChange} value={formData.domicileState || ''} /></label>
            <label>Marital Status 
              <select name="maritalStatus" onChange={handleChange} value={formData.maritalStatus || ''}>
                <option>Single</option>
                <option>Married</option>
                <option>Divorced</option>
                <option>Widowed</option>
                <option>Others</option>
              </select></label>
            <label>Religion <input name="religion" onChange={handleChange} value={formData.religion || ''} /></label>
          </div>
        );
      case 1:
        return (
          <div className="form-step">
            {/* Contact Information */}
            <label>Permanent Address <textarea name="permanentAddress" onChange={handleChange} value={formData.permanentAddress || ''} /></label>
            <label>Correspondence Address <textarea name="correspondenceAddress" onChange={handleChange} value={formData.correspondenceAddress || ''} /></label>
            <label>Mobile Number <input name="phone_number" type="tel" onChange={handleChange} value={formData.phone_number || ''} /></label>
            <label>Alternate Mobile Number <input name="alt_phone_number" type="tel" onChange={handleChange} value={formData.alt_phone_number || ''} /></label>
          </div>
        );
      // case 2:
      // return (
      //   <div className="form-step">
      //     {formData.document_texts &&
      //       Object.entries(formData.document_texts).map(([filename, rawText]) => {
      //         let parsedText = {};
      //         try {
      //           parsedText = JSON.parse(rawText);
      //         } catch (err) {
      //           console.warn(`Failed to parse text from ${filename}`, err);
      //           return null;
      //         }

      //         return (
      //           <fieldset key={filename} style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px" }}>
      //             <legend>Extracted Data from {filename.replace('_text_data', '')}</legend>
      //             <CollapsibleField
      //               data={parsedText}
      //               onChange={(path, value) => handleParsedTextChange(filename, path, value)}
      //               filename={filename}
      //               onAddField={handleAddField}
      //               onRemoveField={handleRemoveField}
      //             />
      //           </fieldset>
      //         );
      //       })}
      //   </div>
      // );
      default:
        return null;
    }
  };

  const completion = calculateCompletionPercentage(formData);

  return (
    <div className={loading ? 'blurred' : ''}>
      <div className="autofill-form">
        <div className="progress-circle">
          <svg viewBox="0 0 36 36" className="circular-chart">
            <path
              className="circle-bg"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#eee"
              strokeWidth="2"
            />
            <path
              className="circle"
              strokeDasharray={`${completion}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#28a745"
              strokeWidth="2"
            />
            <text x="18" y="20.35" className="percentage" textAnchor="middle" fontSize="5">{completion}%</text>
          </svg>
        </div>
        <h2>{steps[step]}</h2>
        {renderStep()}
        {loading && <p style={{ color: 'blue' }}>Saving...</p>}
        <div className="form-navigation">
          {step > 0 && <button onClick={handleBack}>Back</button>}
          {step < steps.length - 1 && <button onClick={handleNext}>Save & Next</button>}
          {step === steps.length - 1 && <button onClick={handleSubmit}>Submit</button>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AutoFillDataForm;
