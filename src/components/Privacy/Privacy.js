import React from 'react';
import { FiLock, FiCheck, FiUser, FiShield } from 'react-icons/fi';

const PrivacyCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 hover:border-blue-200 group relative overflow-hidden h-80 flex flex-col">
    {/* Background decoration */}
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
    
    <div className="relative z-10 flex flex-col h-full">
      <div className="text-center mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-3 text-white text-xl shadow-lg group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-500/30 transition-all duration-300">
          {icon}
        </div>
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

const Privacy = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-40">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.05'%3E%3Cpath d='M30 15c8.284 0 15 6.716 15 15s-6.716 15-15 15-15-6.716-15-15 6.716-15 15-15zm0 2c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-200/50 rounded-full text-sm font-semibold text-blue-700 mb-6 backdrop-blur-sm">
            <FiShield className="w-4 h-4 mr-2" />
            Privacy & Security
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent mb-6 leading-tight">
            Your Privacy is Our Priority
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Bank-level security and complete privacy protection for all your personal data.
          </p>
        </div>

        {/* Privacy Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <PrivacyCard
            icon={<FiLock />}
            title="End-to-End Encryption"
            description="Military-grade encryption protects your documents and personal data before leaving your device."
          />
          
          <PrivacyCard
            icon={<FiCheck />}
            title="Zero-Knowledge Architecture"
            description="Our system ensures even we cannot access your personal information. Only you hold the keys."
          />
          
          <PrivacyCard
            icon={<FiUser />}
            title="Complete User Control"
            description="Delete data anytime, control information sharing, and decide exactly how your data is used."
          />
          
          <PrivacyCard
            icon={<FiShield />}
            title="Private by Design"
            description="Your data never leaves your control. We can't see, access, or sell your information - guaranteed."
          />
        </div>

        {/* Your Data, Your Rights Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">Your Data, Your Rights</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:shadow-md transition-all duration-300">
              Right to Access
            </span>
            <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:shadow-md transition-all duration-300">
              Right to Rectification
            </span>
            <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:shadow-md transition-all duration-300">
              Right to Erasure
            </span>
            <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:shadow-md transition-all duration-300">
              Right to Portability
            </span>
            <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:shadow-md transition-all duration-300">
              Right to Object
            </span>
            <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:shadow-md transition-all duration-300">
              Right to Restrict Processing
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Privacy;
