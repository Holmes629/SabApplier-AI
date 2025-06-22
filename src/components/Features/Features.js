import React from 'react';
import { 
  FiDownload, 
  FiZap, 
  FiShield, 
  FiBell, 
  FiSearch, 
  FiFileText 
} from 'react-icons/fi';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 hover:border-blue-200 group relative overflow-hidden h-80 flex flex-col">{/* Fixed height h-80 for uniform cards */}
    {/* Background decoration */}
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
    
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex items-start space-x-5 flex-1">
        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-500/30 transition-all duration-300">
          {icon}
        </div>
        <div className="flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-blue-700 transition-colors duration-300">{title}</h3>
          <p className="text-gray-600 leading-relaxed text-base flex-1">{description}</p>
        </div>
      </div>
    </div>
    
    {/* Hover effect border */}
    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200/50 transition-all duration-300"></div>
  </div>
);

const Features = () => {
  const features = [
    {
      icon: <FiDownload />,
      title: "Upload Once, Use Everywhere",
      description: "Securely store your certificates, IDs, and documents in the cloud. Reuse them across unlimited applications without repeated uploads."
    },
    {
      icon: <FiZap />,
      title: "AI-Powered Autofill",
      description: "Our intelligent browser extension reads any form and automatically fills your information in seconds with 99.9% accuracy."
    },
    {
      icon: <FiShield />,
      title: "Bank-Level Security",
      description: "Your data is encrypted with military-grade security and stored safely. You maintain complete control over your information."
    },
    {
      icon: <FiBell />,
      title: "Smart Notifications",
      description: "Never miss a deadline again. Get intelligent reminders for application deadlines, status updates, and important notifications."
    },
    {
      icon: <FiSearch />,
      title: "Opportunity Discovery",
      description: "AI-powered job discovery finds relevant job postings and exam opportunities that perfectly match your profile and interests."
    },
    {
      icon: <FiFileText />,
      title: "Application Tracking",
      description: "Organize and track all your applications in one centralized dashboard. Monitor status updates and see your next steps clearly."
    }
  ];

  return (
    <section id="features" className="py-12 bg-white relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 pb-12 lg:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-200/50 rounded-full text-sm font-semibold text-blue-700 mb-6 backdrop-blur-sm">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Powerful Features
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent mb-6 leading-tight">
            Everything You Need to Apply Smarter
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Streamline your entire application process with AI-powered tools designed to save time and reduce errors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="transform hover:-translate-y-2 transition-transform duration-300">
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </div>
          ))}
        </div>
        
        {/* Call to action removed to reduce dead links */}
      </div>
    </section>
  );
};

export default Features;
