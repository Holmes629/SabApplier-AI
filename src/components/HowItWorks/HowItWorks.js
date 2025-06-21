import React from 'react';
import { FaFileAlt, FaLink, FaMicrophone, FaCheck } from 'react-icons/fa';

const HowItWorksStep = ({ stepNumber, icon, title, description }) => (
  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 hover:border-blue-200 group relative overflow-hidden h-80 flex flex-col">
    {/* Background decoration */}
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
    
    <div className="relative z-10 flex flex-col h-full">
      <div className="text-center mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-3 text-white text-xl shadow-lg group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-500/30 transition-all duration-300">
          {icon}
        </div>
        <div className="text-xs font-bold text-blue-600 mb-2 tracking-wide">STEP {stepNumber.toString().padStart(2, '0')}</div>
      </div>
      
      <div className="flex-1 flex flex-col text-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-blue-700 transition-colors duration-300 leading-tight">{title}</h3>
        <p className="text-gray-600 leading-relaxed text-sm mt-auto">{description}</p>
      </div>
    </div>
    
    {/* Hover effect border */}
    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200/50 transition-all duration-300"></div>
  </div>
);

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-40">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.05'%3E%3Cpath d='M30 15c8.284 0 15 6.716 15 15s-6.716 15-15 15-15-6.716-15-15 6.716-15 15-15zm0 2c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 lg:px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-200/50 rounded-full text-sm font-semibold text-blue-700 mb-6 backdrop-blur-sm">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Simple Process
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent mb-6 leading-tight">
            How SabApplier AI Works
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            A simple 4-step process that transforms how you handle applications forever.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {[
            {
              stepNumber: 1,
              icon: <FaFileAlt />,
              title: "Upload Your Documents",
              description: "Securely upload your Aadhar card, PAN card, certificates, and other important documents to your SabApplier profile."
            },
            {
              stepNumber: 2,
              icon: <FaLink />,
              title: "Install Browser Extension",
              description: "Add our smart extension to Chrome, Firefox, or Safari. It integrates seamlessly with any online form."
            },
            {
              stepNumber: 3,
              icon: <FaMicrophone />,
              title: "Auto-Fill Forms Instantly",
              description: "Click the SabApplier extension when you encounter a form. It reads and fills your data automatically."
            },
            {
              stepNumber: 4,
              icon: <FaCheck />,
              title: "Review & Submit",
              description: "Always review the auto-filled information, make any necessary adjustments, and submit with confidence."
            }
          ].map((step, index) => (
            <div key={index} className="transform hover:-translate-y-2 transition-transform duration-300">
              <HowItWorksStep {...step} />
            </div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-blue-600 font-semibold">
            <span>Ready to streamline your applications?</span>
            <svg className="w-5 h-5 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
