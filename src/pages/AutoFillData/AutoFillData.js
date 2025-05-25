import React, { useState, useEffect } from 'react';
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
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('autoFillData');
    return saved ? JSON.parse(saved) : {};
  });
  const [filePreviews, setFilePreviews] = useState({});

  useEffect(() => {
    localStorage.setItem('autoFillData', JSON.stringify(formData));
  }, [formData]);

  const handleNext = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreviews((prev) => ({ ...prev, [name]: reader.result }));
        setFormData((prev) => ({ ...prev, [name]: files[0] }));
      };
      reader.readAsDataURL(files[0]);
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
            <label>Date of Birth <input type="date" name="dob" onChange={handleChange} value={formData.dob || ''} /></label>
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
            <label>Domicile State <input name="domicile" onChange={handleChange} value={formData.domicile || ''} /></label>
            <label>Marital Status 
              <select name="maritalStatus" onChange={handleChange} value={formData.maritalStatus || ''}>
                <option>Single</option>
                <option>Married</option>
                <option>Others</option>
              </select></label>
            <label>Religion <input name="religion" onChange={handleChange} value={formData.religion || ''} /></label>
            <label>Identification Type 
              <select name="idType" onChange={handleChange} value={formData.idType || ''}>
                <option>Aadhaar</option>
                <option>PAN</option>
                <option>Passport</option>
              </select></label>
            <label>Identification Number <input name="idNumber" onChange={handleChange} value={formData.idNumber || ''} /></label>
          </div>
        );
      case 1:
        return (
          <div className="form-step">
            {/* Contact Information */}
            <label>Permanent Address <input name="permanentAddress" onChange={handleChange} value={formData.permanentAddress || ''} /></label>
            <label>Correspondence Address <input name="correspondenceAddress" onChange={handleChange} value={formData.correspondenceAddress || ''} /></label>
            <label>State & District of Residence <input name="stateResidence" onChange={handleChange} value={formData.stateResidence || ''} /></label>
            <label>Email ID <input name="email" type="email" onChange={handleChange} value={formData.email || ''} /></label>
            <label>Mobile Number <input name="mobile" type="tel" onChange={handleChange} value={formData.mobile || ''} /></label>
            <label>Alternate Mobile Number <input name="altMobile" type="tel" onChange={handleChange} value={formData.altMobile || ''} /></label>
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
        <div className="form-navigation">
          {step > 0 && <button onClick={handleBack}>Back</button>}
          {step < steps.length - 1 && <button onClick={handleNext}>Next</button>}
          {step === steps.length - 1 && <button onClick={() => alert('Form submitted!')}>Submit</button>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AutoFillDataForm;
