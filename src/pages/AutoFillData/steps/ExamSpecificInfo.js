import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  examApplyingFor: yup.string().required('Please select an exam'),
  preferredCities: yup.array()
    .of(yup.string())
    .min(1, 'Select at least one preferred city')
    .max(4, 'Maximum 4 cities can be selected')
    .required('Preferred cities are required'),
  mediumOfQuestionPaper: yup.string()
    .oneOf(['Hindi', 'English', 'Other'], 'Please select a valid medium')
    .required('Medium of question paper is required'),
  disabilityStatus: yup.string()
    .oneOf(['Yes', 'No'], 'Please select a valid option')
    .required('Disability status is required'),
  requireScribe: yup.string()
    .oneOf(['Yes', 'No'], 'Please select a valid option')
    .when('disabilityStatus', {
      is: 'Yes',
      then: yup.string().required('Please specify if you require a scribe')
    }),
  previousAttempts: yup.string()
    .oneOf(['Yes', 'No'], 'Please select a valid option')
    .required('Previous attempts status is required'),
  numberOfAttempts: yup.number()
    .when('previousAttempts', {
      is: 'Yes',
      then: yup.number()
        .typeError('Number of attempts must be a number')
        .min(1, 'Minimum 1 attempt')
        .max(10, 'Maximum 10 attempts')
        .required('Number of attempts is required')
    }),
  modeOfPreparation: yup.string()
    .oneOf(['Coaching', 'Self-study', 'Online'], 'Please select a valid mode')
    .required('Mode of preparation is required')
});

const AVAILABLE_CITIES = [
  'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata',
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
];

function ExamSpecificInfo({ data, onComplete }) {
  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: data || {
      preferredCities: [],
      disabilityStatus: 'No',
      requireScribe: 'No',
      previousAttempts: 'No',
      numberOfAttempts: 0
    }
  });

  const [selectedCities, setSelectedCities] = useState(data?.preferredCities || []);
  const watchDisabilityStatus = watch('disabilityStatus');
  const watchPreviousAttempts = watch('previousAttempts');

  useEffect(() => {
    if (data) {
      Object.keys(data).forEach(key => {
        setValue(key, data[key]);
      });
      setSelectedCities(data.preferredCities || []);
    }
  }, [data, setValue]);

  const handleCityChange = (city) => {
    let newCities;
    if (selectedCities.includes(city)) {
      newCities = selectedCities.filter(c => c !== city);
    } else {
      if (selectedCities.length < 4) {
        newCities = [...selectedCities, city];
      } else {
        return; // Don't add more than 4 cities
      }
    }
    setSelectedCities(newCities);
    setValue('preferredCities', newCities);
  };

  const onSubmit = (formData) => {
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="exam-specific-info-form">
      <div className="form-group">
        <label className="form-label">Exam Applying For*</label>
        <select
          className={`form-control ${errors.examApplyingFor ? 'is-invalid' : ''}`}
          {...register('examApplyingFor')}
        >
          <option value="">Select Exam</option>
          <option value="JEE">JEE (Joint Entrance Examination)</option>
          <option value="NEET">NEET (National Eligibility cum Entrance Test)</option>
          <option value="UPSC">UPSC Civil Services</option>
          <option value="SSC">SSC (Staff Selection Commission)</option>
          <option value="GATE">GATE (Graduate Aptitude Test in Engineering)</option>
        </select>
        {errors.examApplyingFor && <div className="invalid-feedback">{errors.examApplyingFor.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Preferred Exam Cities* (Select up to 4)</label>
        <div className="city-checkboxes">
          {AVAILABLE_CITIES.map(city => (
            <div key={city} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={`city-${city}`}
                checked={selectedCities.includes(city)}
                onChange={() => handleCityChange(city)}
              />
              <label className="form-check-label" htmlFor={`city-${city}`}>
                {city}
              </label>
            </div>
          ))}
        </div>
        {errors.preferredCities && <div className="invalid-feedback">{errors.preferredCities.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Medium of Question Paper*</label>
        <select
          className={`form-control ${errors.mediumOfQuestionPaper ? 'is-invalid' : ''}`}
          {...register('mediumOfQuestionPaper')}
        >
          <option value="">Select Medium</option>
          <option value="Hindi">Hindi</option>
          <option value="English">English</option>
          <option value="Other">Other</option>
        </select>
        {errors.mediumOfQuestionPaper && <div className="invalid-feedback">{errors.mediumOfQuestionPaper.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Do you have any disability?*</label>
        <select
          className={`form-control ${errors.disabilityStatus ? 'is-invalid' : ''}`}
          {...register('disabilityStatus')}
        >
          <option value="">Select Option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        {errors.disabilityStatus && <div className="invalid-feedback">{errors.disabilityStatus.message}</div>}
      </div>

      {watchDisabilityStatus === 'Yes' && (
        <div className="form-group">
          <label className="form-label">Do you require a scribe?*</label>
          <select
            className={`form-control ${errors.requireScribe ? 'is-invalid' : ''}`}
            {...register('requireScribe')}
          >
            <option value="">Select Option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {errors.requireScribe && <div className="invalid-feedback">{errors.requireScribe.message}</div>}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Have you attempted this exam before?*</label>
        <select
          className={`form-control ${errors.previousAttempts ? 'is-invalid' : ''}`}
          {...register('previousAttempts')}
        >
          <option value="">Select Option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        {errors.previousAttempts && <div className="invalid-feedback">{errors.previousAttempts.message}</div>}
      </div>

      {watchPreviousAttempts === 'Yes' && (
        <div className="form-group">
          <label className="form-label">Number of Previous Attempts*</label>
          <input
            type="number"
            className={`form-control ${errors.numberOfAttempts ? 'is-invalid' : ''}`}
            {...register('numberOfAttempts')}
            min="1"
            max="10"
          />
          {errors.numberOfAttempts && <div className="invalid-feedback">{errors.numberOfAttempts.message}</div>}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Mode of Preparation*</label>
        <select
          className={`form-control ${errors.modeOfPreparation ? 'is-invalid' : ''}`}
          {...register('modeOfPreparation')}
        >
          <option value="">Select Mode</option>
          <option value="Coaching">Coaching</option>
          <option value="Self-study">Self-study</option>
          <option value="Online">Online</option>
        </select>
        {errors.modeOfPreparation && <div className="invalid-feedback">{errors.modeOfPreparation.message}</div>}
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

export default ExamSpecificInfo; 