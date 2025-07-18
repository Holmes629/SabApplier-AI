import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import Features from '../../components/Features/Features';
import Privacy from '../../components/Privacy/Privacy';
import HowItWorks from '../../components/HowItWorks/HowItWorks';
import Testimonials from '../../components/Testimonials/Testimonials';
import CTA from '../../components/CTA/CTA';
import Footer from '../../components/Footer/Footer';
import FloatingVideoDemo from '../../components/FloatingVideoDemo';
import { Sparkles, X } from 'lucide-react';

const Intro = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar isAuthenticated={false} />
      <section id="hero" className='-mb-10'>
        <Hero />
      </section>
      {/* Floating Video Demo (Portal) */}
      <FloatingVideoDemo />
      <section id="how-it-works" className="pt-0">
        <HowItWorks />
      </section>
      <section id="features" className="-mt-8">
        <Features />
      </section>
      <section id="privacy" className="-mt-8">
        <Privacy />
      </section>
      <section id="testimonials" className="-mt-8">
        <Testimonials />
      </section>
      <section id="cta" className="-mt-8">
        <CTA />
      </section>
      <Footer />
    </div>
  );
};

export default Intro;
