import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  goalType: yup.string()
    .oneOf(['College Admission', 'Govt Job', 'Private Job'], 'Please select a valid goal type')
    .required('Goal type is required'),
  fieldOfInterest: yup.string()
    .required('Field of interest is required'),
  preferredDegreeType: yup.string()
    .oneOf(['UG', 'Diploma', 'PG'], 'Please select a valid degree type')
    .required('Preferred degree type is required'),
  examLevelPreference: yup.string()
    .oneOf(['State', 'Central', 'Both'], 'Please select a valid exam level')
    .required('Exam level preference is required'),
  languagePreference: yup.string()
    .oneOf(['Hindi', 'English', 'Others'], 'Please select a valid language')
    .required('Language preference is required'),
  preferredStudyMode: yup.string()
    .oneOf(['Online', 'Offline', 'Hybrid'], 'Please select a valid study mode')
    .required('Preferred study mode is required'),
  preferredLocation: yup.string()
    .required('Preferred location is required'),
  budget: yup.number()
    .typeError('Budget must be a number')
    .min(10000, 'Minimum budget is ₹10,000')
    .max(500000, 'Maximum budget is ₹5,00,000')
    .required('Budget is required'),
  requireHostel: yup.string()
    .oneOf(['Yes', 'No'], 'Please select a valid option')
    .required('Please specify if you require hostel'),
  requireScholarship: yup.string()
    .oneOf(['Yes', 'No'], 'Please select a valid option')
    .required('Please specify if you require scholarship'),
  dreamColleges: yup.string(),
  pastExamAttempts: yup.string()
});

const FIELDS_OF_INTEREST = [
  'Medical', 'Engineering', 'Law', 'Business', 'Arts',
  'Science', 'Commerce', 'Agriculture', 'Architecture',
  'Design', 'Education', 'IT & Computer Science'
];

function CareerGoals({ data, onComplete }) {
  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: data || {
      goalType: '',
      fieldOfInterest: '',
      preferredDegreeType: '',
      examLevelPreference: '',
      languagePreference: '',
      preferredStudyMode: '',
      preferredLocation: '',
      budget: 100000,
      requireHostel: 'No',
      requireScholarship: 'No',
      dreamColleges: '',
      pastExamAttempts: ''
    }
  });

  const watchGoalType = watch('goalType');
  const watchBudget = watch('budget');

  useEffect(() => {
    if (data) {
      Object.keys(data).forEach(key => {
        setValue(key, data[key]);
      });
    }
  }, [data, setValue]);

  const onSubmit = (formData) => {
    onComplete(formData);
  };

  const formatBudget = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="career-goals-form">
      <div className="form-group">
        <label className="form-label">Goal Type*</label>
        <select
          className={`form-control ${errors.goalType ? 'is-invalid' : ''}`}
          {...register('goalType')}
        >
          <option value="">Select Goal Type</option>
          <option value="College Admission">College Admission</option>
          <option value="Govt Job">Government Job</option>
          <option value="Private Job">Private Job</option>
        </select>
        {errors.goalType && <div className="invalid-feedback">{errors.goalType.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Field of Interest*</label>
        <select
          className={`form-control ${errors.fieldOfInterest ? 'is-invalid' : ''}`}
          {...register('fieldOfInterest')}
        >
          <option value="">Select Field</option>
          {FIELDS_OF_INTEREST.map(field => (
            <option key={field} value={field}>{field}</option>
          ))}
        </select>
        {errors.fieldOfInterest && <div className="invalid-feedback">{errors.fieldOfInterest.message}</div>}
      </div>

      {watchGoalType === 'College Admission' && (
        <div className="form-group">
          <label className="form-label">Preferred Degree Type*</label>
          <select
            className={`form-control ${errors.preferredDegreeType ? 'is-invalid' : ''}`}
            {...register('preferredDegreeType')}
          >
            <option value="">Select Degree Type</option>
            <option value="UG">Undergraduate (UG)</option>
            <option value="Diploma">Diploma</option>
            <option value="PG">Postgraduate (PG)</option>
          </select>
          {errors.preferredDegreeType && <div className="invalid-feedback">{errors.preferredDegreeType.message}</div>}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Exam Level Preference*</label>
        <select
          className={`form-control ${errors.examLevelPreference ? 'is-invalid' : ''}`}
          {...register('examLevelPreference')}
        >
          <option value="">Select Level</option>
          <option value="State">State Level</option>
          <option value="Central">Central Level</option>
          <option value="Both">Both</option>
        </select>
        {errors.examLevelPreference && <div className="invalid-feedback">{errors.examLevelPreference.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Language Preference*</label>
        <select
          className={`form-control ${errors.languagePreference ? 'is-invalid' : ''}`}
          {...register('languagePreference')}
        >
          <option value="">Select Language</option>
          <option value="Hindi">Hindi</option>
          <option value="English">English</option>
          <option value="Others">Others</option>
        </select>
        {errors.languagePreference && <div className="invalid-feedback">{errors.languagePreference.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Preferred Study Mode*</label>
        <select
          className={`form-control ${errors.preferredStudyMode ? 'is-invalid' : ''}`}
          {...register('preferredStudyMode')}
        >
          <option value="">Select Study Mode</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
          <option value="Hybrid">Hybrid</option>
        </select>
        {errors.preferredStudyMode && <div className="invalid-feedback">{errors.preferredStudyMode.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Preferred Location*</label>
        <input
          type="text"
          className={`form-control ${errors.preferredLocation ? 'is-invalid' : ''}`}
          {...register('preferredLocation')}
          placeholder="Enter city or state"
        />
        {errors.preferredLocation && <div className="invalid-feedback">{errors.preferredLocation.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Budget (per year)*</label>
        <div className="budget-slider">
          <input
            type="range"
            className="form-range"
            min="10000"
            max="500000"
            step="10000"
            {...register('budget')}
          />
          <div className="budget-value">{formatBudget(watchBudget)}</div>
        </div>
        {errors.budget && <div className="invalid-feedback">{errors.budget.message}</div>}
      </div>

      <div className="form-row">
        <div className="form-group col-md-6">
          <label className="form-label">Require Hostel?*</label>
          <select
            className={`form-control ${errors.requireHostel ? 'is-invalid' : ''}`}
            {...register('requireHostel')}
          >
            <option value="">Select Option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {errors.requireHostel && <div className="invalid-feedback">{errors.requireHostel.message}</div>}
        </div>

        <div className="form-group col-md-6">
          <label className="form-label">Require Scholarship?*</label>
          <select
            className={`form-control ${errors.requireScholarship ? 'is-invalid' : ''}`}
            {...register('requireScholarship')}
          >
            <option value="">Select Option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {errors.requireScholarship && <div className="invalid-feedback">{errors.requireScholarship.message}</div>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Dream Colleges/Exams</label>
        <textarea
          className={`form-control ${errors.dreamColleges ? 'is-invalid' : ''}`}
          {...register('dreamColleges')}
          rows="3"
          placeholder="List your dream colleges or exams (optional)"
        />
        {errors.dreamColleges && <div className="invalid-feedback">{errors.dreamColleges.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Past Exam Attempts</label>
        <textarea
          className={`form-control ${errors.pastExamAttempts ? 'is-invalid' : ''}`}
          {...register('pastExamAttempts')}
          rows="3"
          placeholder="List any past exam attempts (optional)"
        />
        {errors.pastExamAttempts && <div className="invalid-feedback">{errors.pastExamAttempts.message}</div>}
      </div>

      <div className="form-group">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isValid}
        >
          Save & Continue
        </button>
      </div>
    </form>
  );
}

export default CareerGoals; 