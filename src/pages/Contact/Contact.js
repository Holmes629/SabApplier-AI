import React, { useState } from 'react';
import { api } from '../../services/api';

const initialForm = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      // Call the backend API
      const response = await api.contactUs(form);
      
      if (response.success) {
        setSuccess('Thank you for contacting us! We will get back to you soon.');
        setForm(initialForm);
      } else {
        setError(response.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      <div className="max-w-3xl w-full max-h-[90vh] bg-white rounded-2xl shadow-xl p-4 md:p-8 border border-blue-100 flex flex-col justify-center overflow-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-2 text-center">Contact Us</h1>
        <div className="mb-4 text-center">
          <p className="text-gray-600 max-w-xl mx-auto">
            <span className="font-semibold text-blue-700">Need support?</span> Fill out the form below and our team will respond as soon as possible.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            <span className="font-semibold">For bug reports, feature requests, or general feedback, please use our </span>
            <a href="https://forms.gle/LF873a6PqVE9sNmQ9" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Feedback Form</a>.
        </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 flex-1">
          {/* Contact Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50"
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50"
                placeholder="you@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50"
                placeholder="Subject"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50 min-h-[100px]"
                placeholder="Type your message..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-60"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
              ) : null}
              {loading ? 'Sending...' : 'Send Message'}
            </button>
            {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          </form>
          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-6 text-blue-900">
            <div>
              <div className="font-bold text-lg mb-1">Contact Information</div>
              <div className="text-sm">Email: <a href="mailto:sabapplierai100m@gmail.com" className="text-blue-600 hover:underline">sabapplierai100m@gmail.com</a></div>
            </div>
            <div className="font-bold text-lg mb-1">Support</div>
            <div className="flex items-center space-x-3 mt-4">
              <img src="/logo.jpeg" alt="SabApplier Logo" className="w-10 h-10 rounded-xl border border-blue-100" />
              <span className="font-bold text-blue-700 text-lg">SabApplier AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 