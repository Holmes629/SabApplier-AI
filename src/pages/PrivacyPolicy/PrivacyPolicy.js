import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './PrivacyPolicy.css';

const Home = ({ applications, onToggleCart }) => {

  return (
    <main className="privacy-policy-content">
        <h1>Privacy Policy for Sabapplier AI</h1>
        <h3>Effective Date: [May 12, 2025]</h3>
        <p>
            Welcome to Sabapplier AI. Your privacy is of utmost importance to us. This Privacy Policy describes how we collect, use, disclose, and protect your information when you use our website, browser extension, and related services ("Services"). By accessing or using Sabapplier AI, you agree to the terms of this Privacy Policy
        </p>
        <hr></hr>
        <h2>1. Information We Collect</h2>
        <h3>1.1 Personal Information You Provide</h3>
        <p>When you use Sabapplier AI, we may collect the following types of personally identifiable information (“Personal Information”):</p>
        <ul>
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Government ID details (e.g., Aadhaar card, PAN card)</li>
            <li>Educational documents (e.g., 10th, 12th, graduation certificates)</li>
            <li>Residential address</li>
            <li>Profile photo, scanned signatures</li>
            <li>Documents and data you upload to complete forms</li>
            <li>Login credentials (only securely encrypted if stored)</li>
        </ul>
        <h3>1.2 Information Collected Automatically</h3>
        <p>When you access our Services, we may automatically collect:</p>
        <ul>
            <li>Device information (IP address, browser type, OS)</li>
            <li>Usage data (pages visited, features used, timestamps)</li>
            <li>Interaction data (form fields detected, data filled, error logs)</li>
        </ul>
        <h3>1.3 Information from Third Parties</h3>
        <p>We may receive information about you from third-party services like authentication providers, analytics tools, or government portals integrated with our service.</p>
        <hr></hr>
        <h2>2. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
            <li>Autofill and manage complex application forms</li>
            <li>Store and organize your documents securely</li>
            <li>Improve accuracy and performance of form-filling using AI</li>
            <li>Send you notifications about deadlines, form progress, and updates</li>
            <li>Provide customer support and resolve issues</li>
            <li>Conduct research and improve our Services</li>
            <li>Comply with legal obligations</li>
        </ul>
        <hr></hr>
        <h2>3. Human-in-the-Loop</h2>
        <p>Sabapplier AI uses a human-in-the-loop approach, where certain decisions or entries are reviewed manually (with your consent or action) to ensure accuracy and relevance in forms. This may involve temporary viewing of your data by authorized personnel for assistance or verification.</p>
        <hr></hr>
        <h2>4. Sharing of Information</h2>
        <p>We do not sell your personal data. However, we may share your information in the following situations:</p>
        <ul>
            <li>With trusted third-party services: For hosting, analytics (e.g., Google Analytics), payment processing, and form-submission integrations.</li>
            <li>With your consent: When you allow us to share your data with a third-party (e.g., to submit a government or exam application).</li>
            <li>Legal obligations: To comply with applicable laws, regulations, court orders, or law enforcement requests.</li>
            <li>Business transfers: In case of a merger, acquisition, or asset sale, we may transfer your data.</li>
        </ul>
        <hr></hr>
        <h2>5. Data Storage and Security</h2>
        <ul>
            <li>Your documents and personal data are encrypted in transit (HTTPS) and at rest.</li>
            <li>Only authorized personnel have access to sensitive data, strictly on a need-to-know basis.</li>
            <li>We employ industry-standard security practices, including firewalls, encryption, and access controls.</li>
            <li>You may request deletion of your data at any time.</li>
        </ul>
        <hr></hr>
        <h2>6. International Data Transfer</h2>
        <p>As we operate globally, your data may be processed or stored in countries outside your own. We ensure adequate safeguards are in place as per applicable data protection laws (e.g., GDPR if you're in the EU).</p>
        <hr></hr>
        <h2>7. Your Rights</h2>
        <p>Depending on your location, you may have the following rights:</p>
        <ul>
            <li>Access: You can request a copy of your stored data.</li>
            <li>Correction: You may update inaccurate information.</li>
            <li>Deletion: You may request permanent deletion of your account and data.</li>
            <li>Objection/Restriction: You may object to certain data uses or restrict processing.</li>
            <li>Portability: You can request export of your data in machine-readable format.</li>
        </ul>
        <p>Contact us at sabapplierai100M@gmail.com to exercise any of these rights.</p>
        <hr></hr>
        <h2>8. Cookies and Tracking Technologies</h2>
        <p>We use cookies and similar tools for:</p>
        <ul>
            <li>Authentication</li>
            <li>Session tracking</li>
            <li>Analytics and performance</li>
            <li>Remembering preferences</li>
        </ul>
        <p>You can control or disable cookies via your browser settings.</p>
        <hr></hr>
        <h2>9. Marketing and Communication</h2>
        <p>By signing up, you agree to receive service-related emails and reminders. You may also receive promotional emails and updates. You can opt out anytime via the unsubscribe link or by contacting us.</p>
        <hr></hr>
        <h2>10. Children’s Privacy</h2>
        <p>Our services are not directed to children under 13 (or under 16 in certain jurisdictions). We do not knowingly collect data from minors without parental consent.</p>
        <hr></hr>
        <h2>11. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with a revised "Effective Date." We encourage you to review it periodically.</p>
        <hr></hr>
        <h2>12. Contact Us</h2>
        <p>If you have any questions, concerns, or requests regarding this Privacy Policy or your data, please contact us at:</p>
        <p><b>Sabapplier AI</b></p>
        <p>
            Email: [sabapplierai100m@gmail.com]  
            Website: [https://sabapplier.com]
        </p>
    </main>
  );
};

export default Home; 