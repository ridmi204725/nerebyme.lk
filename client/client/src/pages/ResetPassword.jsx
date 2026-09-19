import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const mode = localStorage.getItem('mode') || 'dark';

    const [validations, setValidations] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
        match: false
    });

    useEffect(() => {
        setValidations({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            match: password === confirmPassword && password !== ''
        });
    }, [password, confirmPassword]);

    const isFormValid = Object.values(validations).every(v => v);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5001/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            });

            const data = await response.json();
            if (data.success) {
                setStatus({ type: 'success', message: data.message });
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setStatus({ type: 'error', message: data.error || 'Something went wrong' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to reset password. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Invalid Access</h2>
                    <p>No reset token provided. Please use the link sent to your email.</p>
                    <button onClick={() => navigate('/login')} className="mt-4 text-blue-500 font-bold underline">Back to Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen w-full flex items-center justify-center p-4 font-poppins relative overflow-hidden transition-all duration-500 ${mode === 'dark' ? 'bg-theme-grad' : 'bg-slate-50'}`}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative w-full max-w-lg p-8 md:p-12 rounded-[2.5rem] border shadow-2xl transition-all duration-500 ${mode === 'dark' ? 'bg-white/10 backdrop-blur-2xl border-white/20' : 'bg-white border-slate-200'}`}
            >
                <h2 className={`text-3xl font-bold mb-2 ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>Reset Password</h2>
                <p className={`text-sm opacity-70 mb-8 ${mode === 'dark' ? 'text-teal-200' : 'text-slate-500'}`}>Create a strong, new password for your account.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                        <label className={`text-[10px] font-bold uppercase tracking-widest mb-1 block ${mode === 'dark' ? 'text-teal-300' : 'text-slate-500'}`}>New Password</label>
                        <div className={`flex items-center gap-3 border-b-2 transition-all ${mode === 'dark' ? 'border-white/10 focus-within:border-teal-400' : 'border-slate-200 focus-within:border-slate-400'}`}>
                            <input 
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full bg-transparent font-medium py-3 focus:outline-none ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-teal-300/50 hover:text-teal-300">
                                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="relative group">
                        <label className={`text-[10px] font-bold uppercase tracking-widest mb-1 block ${mode === 'dark' ? 'text-teal-300' : 'text-slate-500'}`}>Confirm Password</label>
                        <div className={`flex items-center gap-3 border-b-2 transition-all ${mode === 'dark' ? 'border-white/10 focus-within:border-teal-400' : 'border-slate-200 focus-within:border-slate-400'}`}>
                            <input 
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full bg-transparent font-medium py-3 focus:outline-none ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}
                            />
                            <FaLock className={mode === 'dark' ? 'text-teal-300/40' : 'text-slate-400'} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-4 rounded-2xl bg-black/5 text-[10px] font-bold uppercase tracking-tighter">
                        <ValidationItem label="8+ Characters" valid={validations.length} />
                        <ValidationItem label="Uppercase (A-Z)" valid={validations.uppercase} />
                        <ValidationItem label="Lowercase (a-z)" valid={validations.lowercase} />
                        <ValidationItem label="Numeric (0-9)" valid={validations.number} />
                        <ValidationItem label="Special Char" valid={validations.special} />
                        <ValidationItem label="Passwords Match" valid={validations.match} />
                    </div>

                    {status.message && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`p-4 rounded-xl text-sm font-medium ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
                        >
                            {status.message} {status.type === 'success' && 'Redirecting to login...'}
                        </motion.div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading || !isFormValid}
                        className="w-full py-4 rounded-xl bg-theme-btn text-white font-bold text-lg shadow-xl hover:brightness-110 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:hover:scale-100"
                    >
                        {loading ? 'Processing...' : 'Securely Reset Password'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

const ValidationItem = ({ label, valid }) => (
    <div className={`flex items-center gap-2 transition-colors ${valid ? 'text-emerald-500' : 'text-red-400 opacity-50'}`}>
        {valid ? <FaCheckCircle /> : <FaTimesCircle />}
        {label}
    </div>
);

export default ResetPassword;
