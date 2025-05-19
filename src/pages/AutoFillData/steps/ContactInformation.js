import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  permanentAddress: yup.string().required('Permanent address is required'),
  correspondenceAddress: yup.string().required('Correspondence address is required'),
  state: yup.string().required('State is required'),
  district: yup.string().required('District is required'),
  email: yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  mobileNumber: yup.string()
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number')
    .required('Mobile number is required'),
  alternateMobileNumber: yup.string()
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number')
    .nullable()
    .transform((value) => (value === '' ? null : value))
});

function ContactInformation({ data, onComplete }) {
  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: data
  });

  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const permanentAddress = watch('permanentAddress');

  useEffect(() => {
    if (data) {
      Object.keys(data).forEach(key => {
        setValue(key, data[key]);
      });
    }
  }, [data, setValue]);

  useEffect(() => {
    if (sameAsPermanent && permanentAddress) {
      setValue('correspondenceAddress', permanentAddress);
    }
  }, [sameAsPermanent, permanentAddress, setValue]);

  const onSubmit = (formData) => {
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contact-information-form">
      <div className="form-group">
        <label className="form-label">Permanent Address*</label>
        <textarea
          className={`form-control ${errors.permanentAddress ? 'is-invalid' : ''}`}
          rows="3"
          {...register('permanentAddress')}
        />
        {errors.permanentAddress && <div className="invalid-feedback">{errors.permanentAddress.message}</div>}
      </div>

      <div className="form-group">
        <div className="form-check mb-2">
          <input
            type="checkbox"
            className="form-check-input"
            id="sameAsPermanent"
            checked={sameAsPermanent}
            onChange={(e) => setSameAsPermanent(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="sameAsPermanent">
            Same as Permanent Address
          </label>
        </div>
        <label className="form-label">Correspondence Address*</label>
        <textarea
          className={`form-control ${errors.correspondenceAddress ? 'is-invalid' : ''}`}
          rows="3"
          {...register('correspondenceAddress')}
          disabled={sameAsPermanent}
        />
        {errors.correspondenceAddress && <div className="invalid-feedback">{errors.correspondenceAddress.message}</div>}
      </div>

      <div className="form-row">
        <div className="form-group col-md-6">
          <label className="form-label">State*</label>
          <input
            type="text"
            className={`form-control ${errors.state ? 'is-invalid' : ''}`}
            {...register('state')}
          />
          {errors.state && <div className="invalid-feedback">{errors.state.message}</div>}
        </div>

        <div className="form-group col-md-6">
          <label className="form-label">District*</label>
          <input
            type="text"
            className={`form-control ${errors.district ? 'is-invalid' : ''}`}
            {...register('district')}
          />
          {errors.district && <div className="invalid-feedback">{errors.district.message}</div>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Email ID*</label>
        <input
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          {...register('email')}
          placeholder="example@email.com"
        />
        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Mobile Number*</label>
        <input
          type="tel"
          className={`form-control ${errors.mobileNumber ? 'is-invalid' : ''}`}
          {...register('mobileNumber')}
          placeholder="Enter 10-digit mobile number"
        />
        {errors.mobileNumber && <div className="invalid-feedback">{errors.mobileNumber.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Alternate Mobile Number</label>
        <input
          type="tel"
          className={`form-control ${errors.alternateMobileNumber ? 'is-invalid' : ''}`}
          {...register('alternateMobileNumber')}
          placeholder="Enter 10-digit mobile number (optional)"
        />
        {errors.alternateMobileNumber && <div className="invalid-feedback">{errors.alternateMobileNumber.message}</div>}
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

export default ContactInformation; 