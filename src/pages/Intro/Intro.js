import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import Features from '../../components/Features/Features';
import Privacy from '../../components/Privacy/Privacy';
import HowItWorks from '../../components/HowItWorks/HowItWorks';
import Testimonials from '../../components/Testimonials/Testimonials';
import CTA from '../../components/CTA/CTA';
import Footer from '../../components/Footer/Footer';

const Intro = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar isAuthenticated={false} />
      <section id="hero">
        <Hero />
      </section>
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <section id="features">
        <Features />
      </section>
      <section id="privacy">
        <Privacy />
      </section>
      <section id="testimonials">
        <Testimonials />
      </section>
      <section id="cta">
        <CTA />
      </section>
      <Footer />
    </div>
  );
};

export default Intro;
