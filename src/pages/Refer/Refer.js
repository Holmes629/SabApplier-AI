import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Gift, Copy, Check, Facebook, Twitter, Mail, MoreHorizontal, User, ArrowRight, MessageCircle } from 'lucide-react';

export default function Refer() {
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await api.getProfile();
        setUserData(response.user_data);
      } catch (e) {
        setError('Failed to load referral data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(userData.referral_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const shareMsg = `Join me on SabApplier AI and unlock advanced features!\n\nMY REFERRAL CODE: *** ${userData.referral_code?.toUpperCase()} ***\n\nSign up here: https://sabapplier.com/signup`;

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!userData.referral_code) return <div className="p-8 text-center">No referral code found.</div>;

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-2">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-blue-100 p-6 sm:p-10 flex flex-col items-center relative overflow-hidden">
        {/* Confetti or subtle background pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-10 select-none">
          <svg width="100%" height="100%" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="30" r="4" fill="#2563eb" />
            <circle cx="350" cy="60" r="3" fill="#ffbf00" />
            <circle cx="200" cy="180" r="2.5" fill="#e53e3e" />
            <circle cx="120" cy="120" r="3" fill="#2563eb" />
            <circle cx="300" cy="150" r="2" fill="#ffbf00" />
            <circle cx="80" cy="180" r="2" fill="#e53e3e" />
          </svg>
        </div>
        {/* Header */}
        <div className="flex items-center gap-2 mb-4 z-10">
          <Gift className="w-7 h-7 text-yellow-400" />
          <h1 className="text-2xl font-bold text-blue-900 tracking-tight">Refer & Earn</h1>
        </div>
        {/* Illustration */}
        <div className="w-full flex justify-center mb-6 z-10">
          <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="25" cy="40" r="14" fill="#f5f7ff" />
            <circle cx="60" cy="40" r="14" fill="#f5f7ff" />
            <circle cx="95" cy="40" r="14" fill="#f5f7ff" />
            <circle cx="25" cy="36" r="7" fill="#2563eb" />
            <circle cx="60" cy="36" r="7" fill="#ffbf00" />
            <circle cx="95" cy="36" r="7" fill="#e53e3e" />
            <path d="M32 36 Q43 20 60 36" stroke="#2563eb" strokeWidth="1.5" fill="none" />
            <path d="M88 36 Q77 20 60 36" stroke="#2563eb" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
        {/* Referral Code Card */}
        <div className="w-full flex flex-col items-center mb-4 z-10">
          <div className="bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-200 rounded-2xl px-8 py-4 flex flex-col items-center shadow-md relative">
            <span className="text-3xl font-mono font-bold text-blue-900 tracking-widest select-all" style={{letterSpacing: 2}}>{userData.referral_code}</span>
            <button
              className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold bg-white/80 px-3 py-1 rounded-full border border-blue-100 shadow-sm transition"
              onClick={handleCopy}
              title="Copy referral code"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Tap to copy'}
            </button>
          </div>
        </div>
        {/* Share Message */}
        <div className="text-center text-blue-800 font-medium mb-4 z-10">
          Share the code with friends to unlock advanced features!
        </div>
        {/* Share Buttons */}
        <div className="flex justify-center gap-4 mb-2 z-10">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=https://sabapplier.com/signup&quote=${encodeURIComponent(shareMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center shadow transition"
            title="Share on Facebook"
          >
            <Facebook className="w-5 h-5 text-blue-700" />
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center shadow transition"
            title="Share on WhatsApp"
          >
            <MessageCircle className="w-5 h-5 text-green-600" />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full bg-blue-50 hover:bg-blue-200 flex items-center justify-center shadow transition"
            title="Share on Twitter"
          >
            <Twitter className="w-5 h-5 text-blue-500" />
          </a>
          <a
            href={`mailto:?subject=Join%20me%20on%20SabApplier%20AI!&body=${encodeURIComponent(shareMsg)}`}
            className="w-11 h-11 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center shadow transition"
            title="Share via Email"
          >
            <Mail className="w-5 h-5 text-red-500" />
          </a>
          <button
            className="w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center shadow transition"
            title="Copy message"
            onClick={() => {navigator.clipboard.writeText(shareMsg); setCopied(true); setTimeout(() => setCopied(false), 1500);}}
          >
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        {/* Success/Unlock Message */}
        <div className="mt-4 w-full flex flex-col items-center z-10">
          {userData.effective_successful_referrals >= 2 ? (
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-xl text-sm font-medium">
              <Check className="w-4 h-4 mr-2" />
              Advanced features unlocked! Thank you for inviting friends.
            </div>
          ) : (
            <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-xl text-sm font-medium">
              <ArrowRight className="w-4 h-4 mr-2" />
              {`Invite ${2 - (userData.effective_successful_referrals ?? 0)} more friend${(2 - (userData.effective_successful_referrals ?? 0)) === 1 ? '' : 's'} to unlock advanced features!`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 