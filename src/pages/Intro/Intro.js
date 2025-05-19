import React from 'react';
import './Intro.css';
import { Link, useNavigate } from 'react-router-dom';

const FeatureStep = ({ icon, title, description }) => (
  <div className="feature-step">
    <div className="feature-icon">{icon}</div>
    <div className="feature-text">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  </div>
);

const InfoCard = ({ icon, title, description }) => (
  <div className="info-card">
    <div className="info-icon">{icon}</div>
    <h4>{title}</h4>
    <p>{description}</p>
  </div>
);

const Login = () => {
  return (
    <div className="landing-container">
      <div className="main-card">
        <div className="intro-header">
          <h1>Sabapplier AI – Simplify Your Form-Filling Journey</h1>
          <p>Upload once. Let AI do the rest.</p>
          <Link to='/login'>
            <button className="main-get-started">Get Started</button>
          </Link>
        </div>

        <div className="feature-steps">
          <FeatureStep
            icon={<span role="img" aria-label="upload">⬆️</span>}
            title="Upload Your Documents"
            description="Store your exam certificates, ID proofs, and other important files securely in one place"
          />
          <span className="arrow">➔</span>
          <FeatureStep
            icon={<span role="img" aria-label="download">⬇️</span>}
            title="Download the Extension"
            description="Add our AI powered assistant to your browser in one click"
          />
          <span className="arrow">➔</span>
          <FeatureStep
            icon={<span role="img" aria-label="form">📄</span>}
            title="Fill Forms Effortlessly"
            description="Sabapplier reads forms, extracts data, and fills for you – fast, accurate, and stress free."
          />
        </div>

        <div className="info-cards">
          <InfoCard
            icon={<span role="img" aria-label="folder">🗂️</span>}
            title="One Place for All Your Documents"
            description="No more searching folders or uploading the same files again and again."
          />
          <InfoCard
            icon={<span role="img" aria-label="ai">🤖</span>}
            title="AI That Works With You"
            description="Smart autofill with human checks – so you're always in control"
          />
          <InfoCard
            icon={<span role="img" aria-label="lock">🔒</span>}
            title="Secure & Reliable"
            description="Your data is encrypted and stored safely – only you control access."
          />
        </div>

        <div className="extension-download">
        <a href="https://chromewebstore.google.com/detail/pbokcepmfdenanohfjfgkilcpgceohhl?utm_source=item-share-cb" target='_blank'>
          <button className="download-extension">Get Our Extension</button>
        </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
