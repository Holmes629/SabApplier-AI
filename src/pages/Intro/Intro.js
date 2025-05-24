import React from 'react';
import './Intro.css';
import Footer from '../../components/Footer/Footer';
import logo from '../../logo.jpeg';
import { Link } from 'react-router-dom';

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

const Intro = () => {
  return (
    <div className="landing-page">

      {/* Navigation */}
      <header className="navbar">
        <Link to="/" className="logo-section">
          <div className="logo">
            <img src={logo} alt="SabApplier AI" />
          </div>
          <h2>SabApplier AI</h2>
        </Link>
        <nav>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Simplify Your Form-Filling Journey</h1>
          <p>Upload once. Let AI do the rest.</p>
          <Link to="/login">
            <button className="main-get-started">Get Started</button>
          </Link>
        </div>
        {/* <img src="/illustration.svg" alt="AI Assistant" className="hero-image" /> */}
      </section>

      {/* Feature Steps */}
      <section className="feature-section">
        <h2>How It Works</h2>
        <div className="feature-steps">
          <FeatureStep
            icon={<span role="img" aria-label="upload">⬆️</span>}
            title="Upload Your Documents"
            description="Store your exam certificates, ID proofs, and other important files securely."
          />
          <span className="arrow">➔</span>
          <FeatureStep
            icon={<span role="img" aria-label="download">⬇️</span>}
            title="Download the Extension"
            description="Add our AI-powered assistant to your browser with one click."
          />
          <span className="arrow">➔</span>
          <FeatureStep
            icon={<span role="img" aria-label="form">📄</span>}
            title="Fill Forms Effortlessly"
            description="Sabapplier reads forms, extracts data, and fills for you – fast, accurate, and stress free."
          />
        </div>
      </section>

      {/* Info Cards */}
      <section className="info-section">
        <h2>Why Choose Sabapplier</h2>
        <div className="info-cards">
          <InfoCard
            icon={<span role="img" aria-label="folder">🗂️</span>}
            title="One Place for All Your Documents"
            description="No more uploading the same files again and again."
          />
          <InfoCard
            icon={<span role="img" aria-label="ai">🤖</span>}
            title="AI That Works With You"
            description="Smart autofill with human checks – you're always in control."
          />
          <InfoCard
            icon={<span role="img" aria-label="lock">🔒</span>}
            title="Secure & Reliable"
            description="Your data is encrypted and securely stored – only you control access."
          />
        </div>
      </section>

      {/* Extension Button */}
      <section className="extension-download">
        <a
          href="https://chromewebstore.google.com/detail/pbokcepmfdenanohfjfgkilcpgceohhl?utm_source=item-share-cb"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="download-extension">Get Our Extension</button>
        </a>
      </section>
      <Footer />
    </div>
  );
};

export default Intro;
