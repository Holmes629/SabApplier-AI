import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ExamDetails.css';
import { api } from '../../services/api';

function ExamDetails({ applications, onToggleShortlist }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const iframeRef = useRef(null);
  const exam = applications.find(app => app.id === parseInt(id));

  if (!exam) {
    return (
      <main className="main-content">
        <div className="error-state">
          <h2>Exam not found</h2>
          <button onClick={() => navigate('/')}>Return to Home</button>
        </div>
      </main>
    );
  }

  const handleVisitClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleAutoFill = async () => {
    setIsAutoFilling(true);
    try {
      // Get the iframe content
      const iframe = iframeRef.current;
      if (!iframe) {
        throw new Error('Iframe not found');
      }

      // Get the iframe's document
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const htmlContent = iframeDoc.documentElement.outerHTML;

      // Send the HTML content to the backend
      const response = await api.autoFill({
        url: exam.officialLink,
        htmlContent: htmlContent
      });
      
      console.log('Auto-fill response:', response);
    } catch (error) {
      console.error('Error during auto-fill:', error);
    } finally {
      setIsAutoFilling(false);
    }
  };

  return (
    <main className="main-content">
      <div className="exam-details-container">
        <div className="exam-header">
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <h1 className="exam-title">{exam.title}</h1>
          <div className="exam-status">
            <span className={`status-badge ${exam.status.toLowerCase().replace(/\s+/g, '-')}`}>
              {exam.status}
            </span>
            {exam.isApplied && <span className="applied-badge">Applied</span>}
          </div>
        </div>

        <div className="exam-content">
          <div className="exam-section">
            <h2>Exam Details</h2>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Application Fees</span>
                <span className="detail-value">{exam.applicationFees}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Deadline</span>
                <span className="detail-value">{exam.deadline}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Conducting Body</span>
                <span className="detail-value">{exam.conductingBody || 'Not specified'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Exam Date</span>
                <span className="detail-value">{exam.examDate || 'Not announced'}</span>
              </div>
            </div>
          </div>

          <div className="exam-section">
            <h2>Eligibility Criteria</h2>
            <div className="eligibility-list">
              {exam.eligibilityCriteria?.map((criteria, index) => (
                <div key={index} className="criteria-item">
                  <span className="criteria-label">{criteria.label}</span>
                  <span className="criteria-value">{criteria.value}</span>
                </div>
              )) || (
                <p className="no-data">Eligibility criteria not specified</p>
              )}
            </div>
          </div>

          <div className="exam-section">
            <h2>Important Dates</h2>
            <div className="dates-list">
              {exam.importantDates?.map((date, index) => (
                <div key={index} className="date-item">
                  <span className="date-label">{date.label}</span>
                  <span className="date-value">{date.value}</span>
                </div>
              )) || (
                <p className="no-data">Important dates not specified</p>
              )}
            </div>
          </div>

          <div className="exam-actions">
            <button 
              className={`shortlist-button ${exam.isShortlisted ? 'active' : ''}`}
              onClick={() => onToggleShortlist(exam.id)}
            >
              {exam.isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
            </button>
            <a 
              href={exam.officialLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="official-link-button"
              onClick={handleVisitClick}
            >
              Visit Official Website
            </a>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>×</button>
            <iframe 
              ref={iframeRef}
              src={exam.officialLink} 
              title="Official Website"
              frameBorder="0"
              allowFullScreen
            />
            <div className="modal-actions">
              <button 
                className="auto-fill-button"
                onClick={handleAutoFill}
                disabled={isAutoFilling}
              >
                {isAutoFilling ? 'Auto-filling...' : 'Auto-fill Form'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ExamDetails; 