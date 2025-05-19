import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  fathersName: yup.string().required("Father's name is required"),
  mothersName: yup.string().required("Mother's name is required"),
  gender: yup.string().oneOf(['Male', 'Female', 'Other'], 'Please select a valid gender').required('Gender is required'),
  dateOfBirth: yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),
  category: yup.string()
    .oneOf(['GEN', 'OBC', 'SC', 'ST', 'EWS'], 'Please select a valid category')
    .required('Category is required'),
  nationality: yup.string()
    .oneOf(['Indian', 'Other'], 'Please select a valid nationality')
    .required('Nationality is required'),
  domicileState: yup.string().required('Domicile state is required'),
  maritalStatus: yup.string()
    .oneOf(['Single', 'Married', 'Others'], 'Please select a valid marital status')
    .required('Marital status is required'),
  religion: yup.string(),
  identificationType: yup.string()
    .oneOf(['Aadhaar', 'PAN', 'Passport'], 'Please select a valid ID type')
    .required('Identification type is required'),
  identificationNumber: yup.string()
    .when('identificationType', {
      is: 'Aadhaar',
      then: yup.string().matches(/^[0-9]{12}$/, 'Aadhaar number must be 12 digits')
    })
    .when('identificationType', {
      is: 'PAN',
      then: yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format')
    })
    .when('identificationType', {
      is: 'Passport',
      then: yup.string().min(8, 'Passport number must be at least 8 characters')
    })
    .required('Identification number is required')
});

function PersonalDetails({ data, onComplete }) {
  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: data
  });

  const watchIdentificationType = watch('identificationType');

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="personal-details-form">
      <div className="form-group">
        <label className="form-label">Full Name (as per Aadhaar/ID)*</label>
        <input
          type="text"
          className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
          {...register('fullName')}
        />
        {errors.fullName && <div className="invalid-feedback">{errors.fullName.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Father's Name*</label>
        <input
          type="text"
          className={`form-control ${errors.fathersName ? 'is-invalid' : ''}`}
          {...register('fathersName')}
        />
        {errors.fathersName && <div className="invalid-feedback">{errors.fathersName.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Mother's Name*</label>
        <input
          type="text"
          className={`form-control ${errors.mothersName ? 'is-invalid' : ''}`}
          {...register('mothersName')}
        />
        {errors.mothersName && <div className="invalid-feedback">{errors.mothersName.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Gender*</label>
        <select
          className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
          {...register('gender')}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <div className="invalid-feedback">{errors.gender.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Date of Birth*</label>
        <input
          type="date"
          className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`}
          {...register('dateOfBirth')}
        />
        {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Category*</label>
        <select
          className={`form-control ${errors.category ? 'is-invalid' : ''}`}
          {...register('category')}
        >
          <option value="">Select Category</option>
          <option value="GEN">GEN</option>
          <option value="OBC">OBC</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
          <option value="EWS">EWS</option>
        </select>
        {errors.category && <div className="invalid-feedback">{errors.category.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Nationality*</label>
        <select
          className={`form-control ${errors.nationality ? 'is-invalid' : ''}`}
          {...register('nationality')}
        >
          <option value="">Select Nationality</option>
          <option value="Indian">Indian</option>
          <option value="Other">Other</option>
        </select>
        {errors.nationality && <div className="invalid-feedback">{errors.nationality.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Domicile State*</label>
        <input
          type="text"
          className={`form-control ${errors.domicileState ? 'is-invalid' : ''}`}
          {...register('domicileState')}
        />
        {errors.domicileState && <div className="invalid-feedback">{errors.domicileState.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Marital Status*</label>
        <select
          className={`form-control ${errors.maritalStatus ? 'is-invalid' : ''}`}
          {...register('maritalStatus')}
        >
          <option value="">Select Marital Status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Others">Others</option>
        </select>
        {errors.maritalStatus && <div className="invalid-feedback">{errors.maritalStatus.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Religion</label>
        <input
          type="text"
          className={`form-control ${errors.religion ? 'is-invalid' : ''}`}
          {...register('religion')}
        />
        {errors.religion && <div className="invalid-feedback">{errors.religion.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Identification Type*</label>
        <select
          className={`form-control ${errors.identificationType ? 'is-invalid' : ''}`}
          {...register('identificationType')}
        >
          <option value="">Select ID Type</option>
          <option value="Aadhaar">Aadhaar</option>
          <option value="PAN">PAN</option>
          <option value="Passport">Passport</option>
        </select>
        {errors.identificationType && <div className="invalid-feedback">{errors.identificationType.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Identification Number*</label>
        <input
          type="text"
          className={`form-control ${errors.identificationNumber ? 'is-invalid' : ''}`}
          {...register('identificationNumber')}
          placeholder={
            watchIdentificationType === 'Aadhaar' ? 'Enter 12-digit Aadhaar number' :
            watchIdentificationType === 'PAN' ? 'Enter PAN number (e.g., ABCDE1234F)' :
            'Enter Passport number'
          }
        />
        {errors.identificationNumber && <div className="invalid-feedback">{errors.identificationNumber.message}</div>}
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

export default PersonalDetails; 