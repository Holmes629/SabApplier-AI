import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Footer from '../../components/Footer/Footer';
import './AutoFillData.css';

const steps = [
  'Personal Details',
  'Contact Information',
  'Academic Details'
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

  const handleNext = () => {
    // Save current formData to localStorage
    localStorage.setItem("formData", JSON.stringify(formData));
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await api.update(formData);
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
      case 2:
        return (
          <div className="form-step">
            {/* Academic Details */}
            {["10th", "12th", "UG"].map((level) => (
              <fieldset key={level}>
                <legend>{level} Details</legend>
                <label>Board/University <input name={`${level}_board`} onChange={handleChange} value={formData[`${level}_board`] || ''} /></label>
                <label>Year of Passing <input name={`${level}_year`} type="number" onChange={handleChange} value={formData[`${level}_year`] || ''} /></label>
                <label>Roll Number <input name={`${level}_roll`} onChange={handleChange} value={formData[`${level}_roll`] || ''} /></label>
                <label>Marks/CGPA <input name={`${level}_marks`} onChange={handleChange} value={formData[`${level}_marks`] || ''} /></label>
                <label>Result Status 
                  <select name={`${level}_status`} onChange={handleChange} value={formData[`${level}_status`] || ''}>
                    <option>Passed</option>
                    <option>Appearing</option>
                  </select></label>
              </fieldset>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="autofill-form">
        <div className="progress-bar">
          <div className="progress" style={{ width: `${stepPercentages[step]}%` }}></div>
          <span>{stepPercentages[step]}% Completed</span>
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
