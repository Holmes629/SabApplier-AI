import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const qualificationSchema = yup.object().shape({
  examName: yup.string().required('Exam name is required'),
  boardUniversity: yup.string().required('Board/University name is required'),
  yearOfPassing: yup.number()
    .typeError('Year must be a number')
    .min(1900, 'Year must be after 1900')
    .max(new Date().getFullYear(), 'Year cannot be in the future')
    .required('Year of passing is required'),
  rollNumber: yup.string().required('Roll number is required'),
  marks: yup.string().required('Marks/Grade is required'),
  resultStatus: yup.string()
    .oneOf(['Passed', 'Appearing'], 'Please select a valid result status')
    .required('Result status is required')
});

const schema = yup.object().shape({
  qualifications: yup.array().of(qualificationSchema)
    .min(1, 'At least one qualification is required')
    .required('Qualifications are required')
});

function AcademicDetails({ data, onComplete }) {
  const { register, control, handleSubmit, formState: { errors, isValid }, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: data || { qualifications: [{ examName: '', boardUniversity: '', yearOfPassing: '', rollNumber: '', marks: '', resultStatus: '' }] }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "qualifications"
  });

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

  const addQualification = () => {
    append({ examName: '', boardUniversity: '', yearOfPassing: '', rollNumber: '', marks: '', resultStatus: '' });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="academic-details-form">
      {fields.map((field, index) => (
        <div key={field.id} className="qualification-section">
          <div className="section-header">
            <h4>Qualification {index + 1}</h4>
            {index > 0 && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => remove(index)}
              >
                Remove
              </button>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Exam Name*</label>
            <select
              className={`form-control ${errors.qualifications?.[index]?.examName ? 'is-invalid' : ''}`}
              {...register(`qualifications.${index}.examName`)}
            >
              <option value="">Select Exam</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 12">Class 12</option>
              <option value="Diploma">Diploma</option>
              <option value="UG">Undergraduate</option>
              <option value="PG">Postgraduate</option>
            </select>
            {errors.qualifications?.[index]?.examName && (
              <div className="invalid-feedback">{errors.qualifications[index].examName.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Board/University Name*</label>
            <input
              type="text"
              className={`form-control ${errors.qualifications?.[index]?.boardUniversity ? 'is-invalid' : ''}`}
              {...register(`qualifications.${index}.boardUniversity`)}
            />
            {errors.qualifications?.[index]?.boardUniversity && (
              <div className="invalid-feedback">{errors.qualifications[index].boardUniversity.message}</div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label className="form-label">Year of Passing*</label>
              <input
                type="number"
                className={`form-control ${errors.qualifications?.[index]?.yearOfPassing ? 'is-invalid' : ''}`}
                {...register(`qualifications.${index}.yearOfPassing`)}
              />
              {errors.qualifications?.[index]?.yearOfPassing && (
                <div className="invalid-feedback">{errors.qualifications[index].yearOfPassing.message}</div>
              )}
            </div>

            <div className="form-group col-md-6">
              <label className="form-label">Roll Number*</label>
              <input
                type="text"
                className={`form-control ${errors.qualifications?.[index]?.rollNumber ? 'is-invalid' : ''}`}
                {...register(`qualifications.${index}.rollNumber`)}
              />
              {errors.qualifications?.[index]?.rollNumber && (
                <div className="invalid-feedback">{errors.qualifications[index].rollNumber.message}</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label className="form-label">Marks/Grade/CGPA*</label>
              <input
                type="text"
                className={`form-control ${errors.qualifications?.[index]?.marks ? 'is-invalid' : ''}`}
                {...register(`qualifications.${index}.marks`)}
                placeholder="Enter percentage or CGPA"
              />
              {errors.qualifications?.[index]?.marks && (
                <div className="invalid-feedback">{errors.qualifications[index].marks.message}</div>
              )}
            </div>

            <div className="form-group col-md-6">
              <label className="form-label">Result Status*</label>
              <select
                className={`form-control ${errors.qualifications?.[index]?.resultStatus ? 'is-invalid' : ''}`}
                {...register(`qualifications.${index}.resultStatus`)}
              >
                <option value="">Select Status</option>
                <option value="Passed">Passed</option>
                <option value="Appearing">Appearing</option>
              </select>
              {errors.qualifications?.[index]?.resultStatus && (
                <div className="invalid-feedback">{errors.qualifications[index].resultStatus.message}</div>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="form-group">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={addQualification}
        >
          Add Another Qualification
        </button>
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

export default AcademicDetails; 