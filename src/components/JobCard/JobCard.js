import React, { useState, useRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Link } from 'react-router-dom';
import './JobCard.css';
import { api } from '../../services/api';

function JobCard({ application, onCart }) {
  const [htmlContent, setHtmlContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const iframeRef = useRef(null);

  const handleClick = (e) => {
    // Prevent navigation if clicking on cart button or official link
    if (e.target.closest('.cart-button') || e.target.closest('.visit-link')) {
      e.preventDefault();
    }
  };

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
      console.log(application.officialLink);
      const response = await api.autoFill(application.officialLink);
      
      // console.log(response);
      // Now auto fill the form using the response from backend
      const autofillData = {
          ".whsOnd": [
            "test name3",
            "testemail3@gmail.com",
            "9987654321"
          ],
          ".KHxj8b": [
            "some random appartment, random street, random block, city3, state3, country3 - 50048",
            "No comments"
          ]
        };

        // const code = `
        // const autofillData = {
        //   ".whsOnd": [
        //     "test name3",
        //     "testemail3@gmail.com",
        //     "9987654321"
        //   ],
        //   ".KHxj8b": [
        //     "some random appartment, random street, random block, city3, state3, country3 - 50048",
        //     "No comments"
        //   ]
        // };
    
        // Object.entries(autofillData).forEach(([selector, values]) => {
        //   const inputs = document.querySelectorAll(selector);

        //   inputs.forEach((input, index) => {
        //     if (values[index] !== undefined) {
        //       input.value = values[index];
        //       input.dispatchEvent(new Event('input', { bubbles: true }));

        //       console.log(✅ Filled ${selector} input #${index + 1} with "${values[index]}");
        //     } else {
        //       console.warn(⚠️ No value provided for ${selector} input #${index + 1});
        //     }
        //   });
        // });`;
    
      // eval(code);
      // const iframe = iframeRef.current // Change to your iframe ID
      // console.log(iframe);
      // const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

      // Object.entries(autofillData).forEach(([selector, values]) => {
      //   const inputs = iframeDoc.querySelectorAll(selector);

      //   inputs.forEach((input, index) => {
      //     if (values[index] !== undefined) {
      //       input.value = values[index];
      //       input.dispatchEvent(new Event('input', { bubbles: true }));

      //       console.log(`✅ Filled ${selector} input #${index + 1} with "${values[index]}"`);
      //     }
      //   });
      // });
      console.log('job done');

      
    } catch (error) {
      console.error('Error during auto-fill:', error);
    } finally {
      setIsAutoFilling(false);
    }
  };

  return (
    <>
      <Link to={`/exam/${application.id}`} className="job-card" onClick={handleClick}>
        <div className="job-card-left">
          <div className="company-logo"></div>
        </div>
        <div className="job-card-content">
          <h3 className="job-title">{application.title}</h3>
          <div className={`job-status ${application.isApplied ? 'applied' : ''}`}>
            <span data-status={application.status}>{application.status}</span>
            {application.isApplied && <span className="applied-tag">Applied</span>}
          </div>
          <div className="job-details">
            <div className="detail-item">
              <span className="detail-label">Application Fees</span>
              <span className="detail-value">{application.applicationFees}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Deadline</span>
              <span className="detail-value">{application.deadline}</span>
            </div>
          </div>
        </div>
        <div className="job-card-right">
          <a href={application.officialLink} target="_blank" rel="noopener noreferrer" className="visit-link" onClick={handleVisitClick}>
            Visit official site →
          </a>
          <button 
            className={`cart-button ${application.isCart ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onCart();
            }}
            aria-label={application.isCart ? "Remove from cart" : "Add to cart"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={application.isCart ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </button>
        </div>
      </Link>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>×</button>
            <iframe 
              ref={iframeRef}
              src={application.officialLink} 
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
    </>
  );
}

export default JobCard; 