import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

const schema = yup.object().shape({
  photo: yup.mixed()
    .required('Photo is required')
    .test('fileSize', 'File size must be less than 5MB', value => {
      if (!value || !value[0]) return true;
      return value[0].size <= MAX_FILE_SIZE;
    })
    .test('fileType', 'Only JPEG, PNG and PDF files are allowed', value => {
      if (!value || !value[0]) return true;
      return ALLOWED_FILE_TYPES.includes(value[0].type);
    }),
  signature: yup.mixed()
    .required('Signature is required')
    .test('fileSize', 'File size must be less than 5MB', value => {
      if (!value || !value[0]) return true;
      return value[0].size <= MAX_FILE_SIZE;
    })
    .test('fileType', 'Only JPEG, PNG and PDF files are allowed', value => {
      if (!value || !value[0]) return true;
      return ALLOWED_FILE_TYPES.includes(value[0].type);
    }),
  thumbImpression: yup.mixed()
    .test('fileSize', 'File size must be less than 5MB', value => {
      if (!value || !value[0]) return true;
      return value[0].size <= MAX_FILE_SIZE;
    })
    .test('fileType', 'Only JPEG, PNG and PDF files are allowed', value => {
      if (!value || !value[0]) return true;
      return ALLOWED_FILE_TYPES.includes(value[0].type);
    }),
  idProof: yup.mixed()
    .required('ID proof is required')
    .test('fileSize', 'File size must be less than 5MB', value => {
      if (!value || !value[0]) return true;
      return value[0].size <= MAX_FILE_SIZE;
    })
    .test('fileType', 'Only JPEG, PNG and PDF files are allowed', value => {
      if (!value || !value[0]) return true;
      return ALLOWED_FILE_TYPES.includes(value[0].type);
    }),
  categoryCertificate: yup.mixed()
    .test('fileSize', 'File size must be less than 5MB', value => {
      if (!value || !value[0]) return true;
      return value[0].size <= MAX_FILE_SIZE;
    })
    .test('fileType', 'Only JPEG, PNG and PDF files are allowed', value => {
      if (!value || !value[0]) return true;
      return ALLOWED_FILE_TYPES.includes(value[0].type);
    }),
  pwdCertificate: yup.mixed()
    .test('fileSize', 'File size must be less than 5MB', value => {
      if (!value || !value[0]) return true;
      return value[0].size <= MAX_FILE_SIZE;
    })
    .test('fileType', 'Only JPEG, PNG and PDF files are allowed', value => {
      if (!value || !value[0]) return true;
      return ALLOWED_FILE_TYPES.includes(value[0].type);
    }),
  domicileCertificate: yup.mixed()
    .test('fileSize', 'File size must be less than 5MB', value => {
      if (!value || !value[0]) return true;
      return value[0].size <= MAX_FILE_SIZE;
    })
    .test('fileType', 'Only JPEG, PNG and PDF files are allowed', value => {
      if (!value || !value[0]) return true;
      return ALLOWED_FILE_TYPES.includes(value[0].type);
    }),
  educationalCertificates: yup.array()
    .of(yup.mixed()
      .test('fileSize', 'File size must be less than 5MB', value => {
        if (!value || !value[0]) return true;
        return value[0].size <= MAX_FILE_SIZE;
      })
      .test('fileType', 'Only JPEG, PNG and PDF files are allowed', value => {
        if (!value || !value[0]) return true;
        return ALLOWED_FILE_TYPES.includes(value[0].type);
      })
    )
    .min(1, 'At least one educational certificate is required')
});

function UploadDocuments({ data, onComplete }) {
  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: data
  });

  const [previews, setPreviews] = useState({});
  const watchPhoto = watch('photo');
  const watchSignature = watch('signature');
  const watchThumbImpression = watch('thumbImpression');
  const watchIdProof = watch('idProof');
  const watchCategoryCertificate = watch('categoryCertificate');
  const watchPwdCertificate = watch('pwdCertificate');
  const watchDomicileCertificate = watch('domicileCertificate');
  const watchEducationalCertificates = watch('educationalCertificates');

  useEffect(() => {
    if (data) {
      Object.keys(data).forEach(key => {
        setValue(key, data[key]);
      });
    }
  }, [data, setValue]);

  const generatePreview = (file) => {
    if (!file || !file[0]) return null;
    return URL.createObjectURL(file[0]);
  };

  useEffect(() => {
    const newPreviews = {
      photo: generatePreview(watchPhoto),
      signature: generatePreview(watchSignature),
      thumbImpression: generatePreview(watchThumbImpression),
      idProof: generatePreview(watchIdProof),
      categoryCertificate: generatePreview(watchCategoryCertificate),
      pwdCertificate: generatePreview(watchPwdCertificate),
      domicileCertificate: generatePreview(watchDomicileCertificate),
      educationalCertificates: watchEducationalCertificates?.map(file => generatePreview(file))
    };

    setPreviews(newPreviews);

    // Cleanup previews when component unmounts
    return () => {
      Object.values(newPreviews).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [
    watchPhoto,
    watchSignature,
    watchThumbImpression,
    watchIdProof,
    watchCategoryCertificate,
    watchPwdCertificate,
    watchDomicileCertificate,
    watchEducationalCertificates
  ]);

  const onSubmit = (formData) => {
    onComplete(formData);
  };

  const renderFileInput = (name, label, required = true, multiple = false) => (
    <div className="form-group">
      <label className="form-label">
        {label}{required && '*'}
      </label>
      <input
        type="file"
        className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
        {...register(name)}
        multiple={multiple}
        accept={ALLOWED_FILE_TYPES.join(',')}
      />
      {errors[name] && <div className="invalid-feedback">{errors[name].message}</div>}
      {previews[name] && (
        <div className="file-preview mt-2">
          {ALLOWED_FILE_TYPES.includes(watch(name)?.[0]?.type) && watch(name)?.[0]?.type.startsWith('image/') ? (
            <img src={previews[name]} alt={label} className="img-preview" />
          ) : (
            <div className="pdf-preview">
              <i className="fas fa-file-pdf"></i>
              <span>{watch(name)?.[0]?.name}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="upload-documents-form">
      <div className="upload-section">
        <h4>Required Documents</h4>
        {renderFileInput('photo', 'Passport Size Photo')}
        {renderFileInput('signature', 'Signature')}
        {renderFileInput('thumbImpression', 'Left Thumb Impression', false)}
        {renderFileInput('idProof', 'ID Proof')}
      </div>

      <div className="upload-section">
        <h4>Additional Documents</h4>
        {renderFileInput('categoryCertificate', 'Category Certificate (SC/ST/OBC/EWS)', false)}
        {renderFileInput('pwdCertificate', 'PwD Certificate', false)}
        {renderFileInput('domicileCertificate', 'Domicile/Residence Certificate', false)}
        {renderFileInput('educationalCertificates', 'Educational Certificates', true, true)}
      </div>

      <div className="form-group">
        <div className="upload-guidelines">
          <h5>Upload Guidelines:</h5>
          <ul>
            <li>Maximum file size: 5MB</li>
            <li>Allowed file types: JPEG, PNG, PDF</li>
            <li>Photo should be recent and clear</li>
            <li>Signature should be in black ink on white background</li>
            <li>All documents should be clearly visible and legible</li>
          </ul>
        </div>
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

export default UploadDocuments; 