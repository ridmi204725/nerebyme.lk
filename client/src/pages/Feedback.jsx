import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCommentAlt, FaCheckCircle, FaArrowRight, FaSmile } from 'react-icons/fa';

const topics = [
  'General Feedback',
  'Bug Report',
  'Feature Request',
  'Listing Issue',
  'UI / Design',
  'Other',
];

const Feedback = () => {
  const [formData, setFormData] = useState({ subject: '', topic: 'General Feedback', message: '', rating: 5 });
  const [submitted, setSubmitted] = useState(false);

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
    setSubmitted(true);
    setFormData({ subject: '', topic: 'General Feedback', message: '', rating: 5 });
  };

  return (
      <div className={`min-h-screen pt-6 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto font-sans transition-colors duration-300 ${isDark ? 'text-white bg-[#0b0f19]' : 'text-gray-950 bg-gray-50'}`}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-xs font-bold px-4 py-1.5 rounded-full mb-5">
            <FaCommentAlt /> FEEDBACK
          </div>
          <h1 className={`text-4xl font-extrabold mb-3 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>Share Your Thoughts</h1>
          <p className={`leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            We value every piece of feedback. Help us make Holiday.lk better for everyone.
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={`border rounded-2xl p-8 shadow-2xl transition-colors duration-300 ${
                isDark ? 'bg-[#11131a] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
            }`}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
                <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
                    <FaCheckCircle className="text-emerald-400 text-3xl" />
                  </div>
                  <h2 className={`text-2xl font-extrabold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>Thank You!</h2>
                  <p className={`mb-7 leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Your feedback has been successfully submitted. We truly appreciate you helping us improve.
                  </p>
                  <button
                      onClick={() => setSubmitted(false)}
                      className="inline-flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-500 transition text-white text-sm font-bold px-6 py-2.5 rounded-xl cursor-pointer"
                  >
                    <FaCommentAlt /> Send Another
                  </button>
                </motion.div>
            ) : (
                <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                  {/* Topic */}
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Topic</label>
                    <div className="flex flex-wrap gap-2">
                      {topics.map(t => (
                          <button
                              key={t}
                              type="button"
                              onClick={() => setFormData({ ...formData, topic: t })}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                                  formData.topic === t
                                      ? 'bg-fuchsia-600 border-fuchsia-500 text-white'
                                      : isDark
                                          ? 'bg-[#161922] border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-200'
                                          : 'bg-gray-100 border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900'
                              }`}
                          >
                            {t}
                          </button>
                      ))}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Subject</label>
                    <input
                        type="text"
                        required
                        placeholder="Brief summary of your feedback..."
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className={`w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:border-fuchsia-500 transition-colors duration-300 ${
                            isDark
                                ? 'bg-[#161922] text-gray-200 border-gray-800 placeholder-gray-600'
                                : 'bg-gray-50 text-gray-900 border-gray-300 placeholder-gray-400'
                        }`}
                    />
                  </div>

                  {/* Overall Rating */}
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Overall Experience</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                          <button
                              key={star}
                              type="button"
                              onClick={() => setFormData({ ...formData, rating: star })}
                              className={`text-2xl transition-all cursor-pointer hover:scale-110 ${star <= formData.rating ? 'text-amber-400' : isDark ? 'text-gray-700' : 'text-gray-300'}`}
                          >
                            ★
                          </button>
                      ))}
                      <span className={`text-xs ml-2 transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                    {formData.rating === 5 ? 'Excellent' : formData.rating === 4 ? 'Good' : formData.rating === 3 ? 'Average' : formData.rating === 2 ? 'Poor' : 'Terrible'}
                  </span>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Message</label>
                    <textarea
                        required
                        placeholder="Describe your feedback in detail..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className={`w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:border-fuchsia-500 resize-none transition-colors duration-300 ${
                            isDark
                                ? 'bg-[#161922] text-gray-200 border-gray-800 placeholder-gray-600'
                                : 'bg-gray-50 text-gray-900 border-gray-300 placeholder-gray-400'
                        }`}
                        rows="5"
                    />
                  </div>

                  <button
                      type="submit"
                      className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 transition text-white text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-fuchsia-900/20"
                  >
                    <FaSmile /> Submit Feedback <FaArrowRight size={12} />
                  </button>
                </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
  );
};

export default Feedback;