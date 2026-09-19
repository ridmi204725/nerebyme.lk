import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuestionCircle, FaChevronDown, FaChevronUp, FaHeadset, FaEnvelope } from 'react-icons/fa';

const faqs = [
  {
    question: 'How do I become a seller?',
    answer: 'Navigate to your Account Settings and fill out the "Become a Seller" request form. Our admin team will review your application and respond within 24–48 hours.'
  },
  {
    question: 'How can I reset my password?',
    answer: 'You can reset your password using the "Forgot Password" link on the login page. Alternatively, if you are already logged in, you can update it directly from your Account Settings page.'
  },
  {
    question: 'How do I add a new place or restaurant?',
    answer: 'Go to the relevant section (e.g., Day Outings, Food Hub, Travel) and click the "+ Add Place" button in the sidebar. Fill in the details and submit — it will be reviewed and published after admin approval.'
  },
  {
    question: 'How do reward points work?',
    answer: 'You earn +1 reward point each time you successfully submit a new location or venue that gets approved. Points can be redeemed for perks in the upcoming Play & Earn feature.'
  },
  {
    question: 'Is Holiday.lk free to use?',
    answer: 'Yes, browsing and basic submissions are completely free. Premium advertising packages are available for businesses that want enhanced visibility and additional features.'
  },
  {
    question: 'What languages does Holiday.lk support?',
    answer: 'Holiday.lk currently supports English, Sinhala, and Tamil. You can switch the language from the top navigation bar at any time.'
  },
];

const FaqItem = ({ faq, index, isDark }) => {
  const [open, setOpen] = useState(false);
  return (
      <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06 }}
          className={`border rounded-2xl overflow-hidden transition-all shadow-xl ${
              isDark
                  ? 'bg-[#11131a] border-gray-800 hover:border-gray-700 text-white'
                  : 'bg-white border-gray-200 hover:border-gray-300 text-gray-900'
          }`}
      >
        <button
            className="w-full flex justify-between items-center px-6 py-5 text-left cursor-pointer"
            onClick={() => setOpen(!open)}
        >
          <span className={`font-semibold text-sm pr-4 transition-colors duration-300 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{faq.question}</span>
          <span className={`shrink-0 transition-colors ${open ? 'text-amber-400' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {open ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
        </span>
        </button>
        <AnimatePresence>
          {open && (
              <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
              >
                <div className={`px-6 pb-5 text-sm leading-relaxed border-t pt-4 transition-colors duration-300 ${
                    isDark ? 'text-gray-400 border-gray-800/60' : 'text-gray-600 border-gray-100'
                }`}>
                  {faq.answer}
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
  );
};

const FaqHelp = () => {
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

  return (
      <div className={`min-h-screen pt-8 pb-16 px-4 md:px-8 max-w-3xl mx-auto font-sans transition-colors duration-300 ${isDark ? 'text-white bg-[#0b0f19]' : 'text-gray-950 bg-gray-50'}`}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold px-4 py-1.5 rounded-full mb-5">
            <FaQuestionCircle /> HELP CENTER
          </div>
          <h1 className={`text-4xl font-extrabold mb-3 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>FAQ &amp; Help</h1>
          <p className={`leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Find quick answers to the most common questions about Holiday.lk.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-3 mb-12">
          {faqs.map((faq, i) => (
              <FaqItem key={i} faq={faq} index={i} isDark={isDark} />
          ))}
        </div>

        {/* Still need help CTA */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`border border-blue-500/30 rounded-2xl p-8 text-center shadow-2xl transition-colors duration-300 ${
                isDark
                    ? 'bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/10 text-white'
                    : 'bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/5 text-gray-900'
            }`}
        >
          <FaHeadset className="text-blue-400 text-3xl mx-auto mb-4" />
          <h2 className={`text-xl font-extrabold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>Still have a question?</h2>
          <p className={`text-sm mb-5 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Our support team is happy to help you with anything not covered above.</p>
          <a
              href="mailto:support@holiday.lk"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-900/20"
          >
            <FaEnvelope /> Contact Support
          </a>
        </motion.div>
      </div>
  );
};

export default FaqHelp;