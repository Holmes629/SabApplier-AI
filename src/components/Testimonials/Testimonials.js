import React from 'react';

const TestimonialCard = ({ name, role, avatar, content, rating }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 min-h-80 flex flex-col">{/* Changed to min-h-80 for flexible height */}
    <div className="flex items-center mb-4">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <p className="text-gray-600 mb-4 leading-relaxed flex-1">"{content}"</p>
    <div className="flex items-center mt-auto">
      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-navy-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
        {name.charAt(0)}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">{name}</h4>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "MBA Student",
      content: "SabApplier saved me hours during my job application process. The AI extension filled forms perfectly every time!",
      rating: 5
    },
    {
      name: "Rahul Kumar",
      role: "Engineering Graduate",
      content: "Never thought form filling could be this easy. The document storage and auto-fill features are game-changers.",
      rating: 5
    },
    {
      name: "Anjali Singh",
      role: "Government Job Aspirant",
      content: "Applied to 50+ government positions in half the time. The accuracy and speed are incredible!",
      rating: 5
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-br from-slate-800 to-primary-600 bg-clip-text text-transparent mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their application process
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
