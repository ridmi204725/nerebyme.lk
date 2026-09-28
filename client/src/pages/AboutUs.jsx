import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaHeart, FaMapMarkerAlt, FaUtensils, FaBuilding, FaUsers, FaShieldAlt, FaLightbulb } from 'react-icons/fa';

const stats = [
  { label: 'Locations Listed', value: '2,400+' },
  { label: 'Happy Users', value: '18,000+' },
  { label: 'Districts Covered', value: '25' },
  { label: 'Monthly Visitors', value: '50K+' },
];

const features = [
  { icon: <FaMapMarkerAlt size={20} />, label: 'Day Outings', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: <FaUtensils size={20} />, label: 'Food Hub', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { icon: <FaBuilding size={20} />, label: 'Functions & Events', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { icon: <FaStar size={20} />, label: 'Travel Sri Lanka', color: 'text-blue-400', bg: 'bg-blue-500/10' },
];

const values = [
  { icon: <FaHeart size={20} />, title: 'Community First', desc: 'Every listing is contributed by real users who love exploring Sri Lanka.', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { icon: <FaShieldAlt size={20} />, title: 'Trusted & Verified', desc: 'All submissions are reviewed and approved by our admin team before going live.', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { icon: <FaLightbulb size={20} />, title: 'Constantly Improving', desc: 'We continuously add new features based on feedback from our growing community.', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
];

const AboutUs = () => {
  const [reviews, setReviews] = useState([
    { id: 1, user: 'John Doe', rating: 5, comment: 'Great platform! Found the perfect venue for my wedding.' },
    { id: 2, user: 'Jane Smith', rating: 4, comment: 'Very helpful to find day out packages. Highly recommended.' },
  ]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const [mode, setMode] = useState(localStorage.getItem('mode') || 'dark');

  useEffect(() => {
    const handleStorageChange = () => {
      const currentMode = localStorage.getItem('mode');
      if (currentMode) setMode(currentMode);
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(() => {
      const storedMode = localStorage.getItem('mode');
      if (storedMode && storedMode !== mode) {
        setMode(storedMode);
      }
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [mode]);

  const isDark = mode === 'dark';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newReview.comment.trim()) {
      setReviews([{ id: Date.now(), user: 'Anonymous', ...newReview }, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
    }
  };

  return (
      <div className={`min-h-screen pt-8 pb-16 px-4 md:px-8 max-w-5xl mx-auto font-sans transition-colors duration-300 ${isDark ? 'text-white bg-[#0b0f19]' : 'text-gray-950 bg-gray-50'}`}>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold px-4 py-1.5 rounded-full mb-5">
            <FaHeart /> OUR STORY
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
            About nearbyme.lk
          </h1>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Sri Lanka's premier platform for discovering and booking holiday experiences, event venues, movie theaters, and food hubs — all in one place.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14"
        >
          {stats.map((s, i) => (
              <div key={i} className={`border rounded-2xl p-5 text-center shadow-xl transition-colors duration-300 ${
                  isDark ? 'bg-[#11131a] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}>
                <div className={`text-2xl font-extrabold mb-1 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>{s.value}</div>
                <div className={`text-xs font-medium transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{s.label}</div>
              </div>
          ))}
        </motion.div>

        {/* About section */}
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`border rounded-2xl p-8 mb-8 shadow-xl transition-colors duration-300 ${
                isDark ? 'bg-[#11131a] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
            }`}
        >
          <h2 className={`text-2xl font-extrabold mb-4 flex items-center gap-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <FaUsers className="text-amber-400" /> Welcome to nearbyme.lk
          </h2>
          <p className={`mb-4 leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            nearbyme.lk is Sri Lanka's premier platform for discovering and booking holiday experiences, event venues, movie theaters, and food hubs. Our mission is to connect users with the best local businesses and provide a seamless, enjoyable experience.
          </p>
          <p className={`leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Whether you are planning a grand wedding, a weekend getaway, a family day out, or just a movie night with friends, nearbyme.lk has everything you need — all in one place.
          </p>

          {/* Feature tags */}
          <div className="flex flex-wrap gap-3 mt-6">
            {features.map((f, i) => (
                <div key={i} className={`flex items-center gap-2 ${f.bg} ${f.color} ${isDark ? 'border-gray-800' : 'border-gray-200'} border text-xs font-bold px-3 py-2 rounded-xl transition-colors duration-300`}>
                  {f.icon} {f.label}
                </div>
            ))}
          </div>
        </motion.div>

        {/* Values */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {values.map((v, i) => (
              <div key={i} className={`border ${v.border} rounded-2xl p-6 shadow-xl transition-all duration-300 ${
                  isDark ? 'bg-[#11131a] hover:border-gray-600 text-white' : 'bg-white hover:border-gray-300 text-gray-900'
              }`}>
                <div className={`${v.bg} ${v.color} w-11 h-11 rounded-xl flex items-center justify-center mb-4`}>{v.icon}</div>
                <h3 className={`font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>{v.title}</h3>
                <p className={`text-sm leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{v.desc}</p>
              </div>
          ))}
        </motion.div>

        {/* Reviews */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={`border rounded-2xl p-8 shadow-xl transition-colors duration-300 ${
            isDark ? 'bg-[#11131a] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <h2 className={`text-2xl font-extrabold mb-6 flex items-center gap-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <FaStar className="text-amber-400" /> Platform Reviews
          </h2>

          {/* Review form */}
          <form onSubmit={handleSubmit} className={`mb-8 p-6 rounded-xl border transition-colors duration-300 ${
              isDark ? 'bg-[#0d0f14] border-gray-800/60' : 'bg-gray-50 border-gray-200'
          }`}>
            <h3 className={`font-semibold mb-4 text-sm transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Leave a Review</h3>
            <div className="mb-4">
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Rating</label>
              <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                  className={`rounded-xl px-3 py-2 text-sm border focus:outline-none focus:border-amber-500 transition-colors duration-300 ${
                      isDark ? 'bg-[#161922] text-gray-200 border-gray-800' : 'bg-white text-gray-900 border-gray-300'
                  }`}
              >
                {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num} Stars</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Comment</label>
              <textarea
                  required
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className={`w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:border-amber-500 resize-none transition-colors duration-300 ${
                      isDark ? 'bg-[#161922] text-gray-200 border-gray-800' : 'bg-white text-gray-900 border-gray-300'
                  }`}
                  rows="3"
                  placeholder="Share your experience..."
              />
            </div>
            <button type="submit" className="bg-amber-600 hover:bg-amber-500 transition text-white text-sm font-bold px-6 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-amber-900/20">
              Submit Review
            </button>
          </form>

          {/* Review list */}
          <div className="space-y-4">
            {reviews.map(review => (
                <div key={review.id} className={`p-4 border-b last:border-0 transition-colors duration-300 ${isDark ? 'border-gray-800/60' : 'border-gray-100'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xs font-extrabold text-white shrink-0">
                      {review.user[0]}
                    </div>
                    <span className={`font-semibold text-sm transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{review.user}</span>
                    <span className="text-amber-400 text-sm ml-1">
                  {'★'.repeat(review.rating)}
                      <span className={isDark ? 'text-gray-700' : 'text-gray-300'}>{'★'.repeat(5 - review.rating)}</span>
                </span>
                  </div>
                  <p className={`text-sm pl-11 leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{review.comment}</p>
                </div>
            ))}
          </div>
        </motion.div>
      </div>
  );
};

export default AboutUs;