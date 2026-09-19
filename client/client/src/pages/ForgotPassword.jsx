import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaPaperPlane, FaChevronLeft } from 'react-icons/fa';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const mode = localStorage.getItem('mode') || 'dark';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch('http://localhost:5001/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (data.success) {
                setStatus({ type: 'success', message: data.message });
            } else {
                setStatus({ type: 'error', message: data.error || 'Something went wrong' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen w-full flex items-center justify-center p-4 font-poppins relative overflow-hidden transition-all duration-500 ${mode === 'dark' ? 'bg-theme-grad' : 'bg-slate-50'}`}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative w-full max-w-md p-8 md:p-12 rounded-[2.5rem] border shadow-2xl transition-all duration-500 ${mode === 'dark' ? 'bg-white/10 backdrop-blur-2xl border-white/20' : 'bg-white border-slate-200'}`}
            >
                <div className="mb-8">
                    <Link to="/login" className="flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 transition-opacity mb-6">
                        <FaChevronLeft size={12} /> Back to Login
                    </Link>
                    <h2 className={`text-3xl font-bold mb-2 ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>Forgot Password?</h2>
                    <p className={`text-sm opacity-70 ${mode === 'dark' ? 'text-teal-200' : 'text-slate-500'}`}>
                        Enter your registered email and we'll send you instructions to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative pb-1 group flex flex-col">
                        <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 mb-1 ${mode === 'dark' ? 'text-teal-300' : 'text-slate-500'}`}>Email Address</label>
                        <div className={`flex items-center gap-3 border-b-2 transition-all ${mode === 'dark' ? 'border-white/10 focus-within:border-teal-400' : 'border-slate-200 focus-within:border-slate-400'}`}>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className={`w-full bg-transparent font-medium py-3 focus:outline-none ${mode === 'dark' ? 'text-white placeholder:text-white/30' : 'text-slate-900 placeholder:text-slate-400'}`}
                            />
                            <FaEnvelope className={mode === 'dark' ? 'text-teal-300/40' : 'text-teal-300 group-focus-within:text-teal-300'} />
                        </div>
                    </div>

                    {status.message && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-xl text-sm font-medium ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
                        >
                            {status.message}
                        </motion.div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-theme-btn text-white font-bold text-lg shadow-xl hover:brightness-110 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : (
                            <>
                                Send Reset Link <FaPaperPlane size={14} />
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
