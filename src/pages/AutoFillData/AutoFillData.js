import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer/Footer';
import './AutoFillData.css';

const steps = [
  'Personal Details',
  'Contact Information',
  'Academic Details',
  'Exam Info',
  'Upload Documents',
  'Career Goals'
];

const stepPercentages = [10, 20, 40, 60, 80, 100];

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
            <label>Full Name <input name="fullName" onChange={handleChange} value={formData.fullName || ''} required /></label>
            <label>Father's Name <input name="fathersName" onChange={handleChange} value={formData.fathersName || ''} required /></label>
            <label>Mother's Name <input name="mothersName" onChange={handleChange} value={formData.mothersName || ''} required /></label>
            <label>Gender <select name="gender" onChange={handleChange} value={formData.gender || ''}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select></label>
            <label>Date of Birth <input type="date" name="dob" onChange={handleChange} value={formData.dob || ''} /></label>
            <label>Category <select name="category" onChange={handleChange} value={formData.category || ''}>
              <option>GEN</option><option>OBC</option><option>SC</option><option>ST</option><option>EWS</option>
            </select></label>
            <label>Nationality <input name="nationality" onChange={handleChange} value={formData.nationality || ''} /></label>
            <label>Domicile State <input name="domicile" onChange={handleChange} value={formData.domicile || ''} /></label>
            <label>Marital Status <select name="maritalStatus" onChange={handleChange} value={formData.maritalStatus || ''}>
              <option>Single</option><option>Married</option><option>Others</option>
            </select></label>
            <label>Religion <input name="religion" onChange={handleChange} value={formData.religion || ''} /></label>
            <label>Identification Type <select name="idType" onChange={handleChange} value={formData.idType || ''}>
              <option>Aadhaar</option><option>PAN</option><option>Passport</option>
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
            <label>State of Residence <input name="stateResidence" onChange={handleChange} value={formData.stateResidence || ''} /></label>
            <label>District of Residence <input name="districtResidence" onChange={handleChange} value={formData.districtResidence || ''} /></label>
            <label>Email ID <input name="email" type="email" onChange={handleChange} value={formData.email || ''} /></label>
            <label>Mobile Number <input name="mobile" type="tel" onChange={handleChange} value={formData.mobile || ''} /></label>
            <label>Alternate Mobile Number <input name="altMobile" type="tel" onChange={handleChange} value={formData.altMobile || ''} /></label>
          </div>
        );
      case 2:
        return (
          <div className="form-step">
            {/* Academic Details */}
            {["10th", "12th", "UG", "PG"].map((level) => (
              <fieldset key={level}>
                <legend>{level} Details</legend>
                <label>Exam Name <input name={`${level}_exam`} onChange={handleChange} value={formData[`${level}_exam`] || ''} /></label>
                <label>Board/University <input name={`${level}_board`} onChange={handleChange} value={formData[`${level}_board`] || ''} /></label>
                <label>Year of Passing <input name={`${level}_year`} type="number" onChange={handleChange} value={formData[`${level}_year`] || ''} /></label>
                <label>Roll Number <input name={`${level}_roll`} onChange={handleChange} value={formData[`${level}_roll`] || ''} /></label>
                <label>Marks/CGPA <input name={`${level}_marks`} onChange={handleChange} value={formData[`${level}_marks`] || ''} /></label>
                <label>Result Status <select name={`${level}_status`} onChange={handleChange} value={formData[`${level}_status`] || ''}>
                  <option>Passed</option><option>Appearing</option>
                </select></label>
              </fieldset>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="form-step">
            {/* Exam Info */}
            <label>Exam Applying For <input name="examApplying" onChange={handleChange} value={formData.examApplying || ''} /></label>
            <label>Preferred Exam Cities <input name="examCities" onChange={handleChange} value={formData.examCities || ''} placeholder="City1, City2..." /></label>
            <label>Medium of Paper <select name="medium" onChange={handleChange} value={formData.medium || ''}>
              <option>Hindi</option><option>English</option><option>Other</option>
            </select></label>
            <label>Disability Status <select name="disability" onChange={handleChange} value={formData.disability || ''}>
              <option>Yes</option><option>No</option>
            </select></label>
            <label>Requirement of Scribe <select name="scribe" onChange={handleChange} value={formData.scribe || ''}>
              <option>Yes</option><option>No</option>
            </select></label>
            <label>Previous Attempts <input name="attempts" type="number" onChange={handleChange} value={formData.attempts || ''} /></label>
            <label>Mode of Preparation <select name="prepMode" onChange={handleChange} value={formData.prepMode || ''}>
              <option>Coaching</option><option>Self-study</option><option>Online</option>
            </select></label>
          </div>
        );
      case 4:
        return (
          <div className="form-step">
            {/* Upload Documents */}
            {['photo', 'signature', 'thumb', 'idProof', 'categoryCert', 'pwdCert', 'domicileCert', 'eduCerts'].map(field => (
              <div key={field}>
                <label>{field.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                  <input type="file" name={field} accept="image/*,.pdf" onChange={handleFileChange} />
                </label>
                {filePreviews[field] && <img src={filePreviews[field]} alt={`${field} preview`} className="file-preview" />}
              </div>
            ))}
          </div>
        );
      case 5:
        return (
          <div className="form-step">
            {/* Career Goals */}
            <label>Goal Type <select name="goalType" onChange={handleChange} value={formData.goalType || ''}>
              <option>College Admission</option><option>Govt Job</option><option>Private Job</option>
            </select></label>
            <label>Field of Interest <input name="fieldInterest" onChange={handleChange} value={formData.fieldInterest || ''} /></label>
            <label>Preferred Degree Type <select name="degreeType" onChange={handleChange} value={formData.degreeType || ''}>
              <option>UG</option><option>Diploma</option><option>PG</option>
            </select></label>
            <label>Exam Level Preference <select name="examLevel" onChange={handleChange} value={formData.examLevel || ''}>
              <option>State</option><option>Central</option><option>Both</option>
            </select></label>
            <label>Language Preference <input name="langPref" onChange={handleChange} value={formData.langPref || ''} /></label>
            <label>Study Mode <select name="studyMode" onChange={handleChange} value={formData.studyMode || ''}>
              <option>Online</option><option>Offline</option><option>Hybrid</option>
            </select></label>
            <label>Preferred Location <input name="locationPref" onChange={handleChange} value={formData.locationPref || ''} /></label>
            <label>Budget (₹10k to ₹5L) <input name="budget" type="range" min="10000" max="500000" step="10000" onChange={handleChange} value={formData.budget || 10000} /></label>
            <label>Require Hostel <select name="hostel" onChange={handleChange} value={formData.hostel || ''}>
              <option>Yes</option><option>No</option>
            </select></label>
            <label>Require Scholarship <select name="scholarship" onChange={handleChange} value={formData.scholarship || ''}>
              <option>Yes</option><option>No</option>
            </select></label>
            <label>Dream Colleges/Exams <input name="dreams" onChange={handleChange} value={formData.dreams || ''} /></label>
            <label>Past Exam Attempts <input name="pastAttempts" onChange={handleChange} value={formData.pastAttempts || ''} /></label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
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
  );
};

export default AutoFillDataForm;
