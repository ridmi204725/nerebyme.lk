import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
    FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaSuitcaseRolling,
    FaPassport, FaCamera, FaCompass, FaFacebook, FaApple, FaMoon, FaSun,
    FaCheckCircle, FaExclamationTriangle
} from 'react-icons/fa';
import { GiPalmTree } from 'react-icons/gi';
import { API_BASE_URL } from '../utils/api';
import bluePlantIllustration from '../assets/blue-plant-illustration.png';
import GoogleAccountModal from '../components/GoogleAccountModal';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [mode, setMode] = useState(localStorage.getItem('mode') || 'dark');
    const [theme, setTheme] = useState(localStorage.getItem('selectedTheme') || 'theme-blue');
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'EN');

    // Custom Toast Notification සඳහා state එක
    const [message, setMessage] = useState({ type: '', text: '' });

    const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
    const [savedAccounts, setSavedAccounts] = useState(() => {
        const saved = localStorage.getItem('googleSavedAccounts');
        return saved ? JSON.parse(saved) : [];
    });

    const [isFacebookModalOpen, setIsFacebookModalOpen] = useState(false);
    const [facebookSavedAccounts, setFacebookSavedAccounts] = useState(() => {
        const saved = localStorage.getItem('facebookSavedAccounts');
        return saved ? JSON.parse(saved) : [];
    });

    const [isAppleModalOpen, setIsAppleModalOpen] = useState(false);
    const [appleSavedAccounts, setAppleSavedAccounts] = useState(() => {
        const saved = localStorage.getItem('appleSavedAccounts');
        return saved ? JSON.parse(saved) : [];
    });

    // Custom Toast පණිවිඩ පෙන්වීම සඳහා වන Helper function එක
    const showNotification = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => {
            setMessage({ type: '', text: '' });
        }, 3500); // තත්පර 3.5 කින් පණිවිඩය ස්වයංක්‍රීයව අතුරුදහන් වේ
    };

    const decodeJwt = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    };

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('selectedTheme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('mode', mode);
    }, [mode]);

    useEffect(() => {
        localStorage.setItem('lang', lang);
    }, [lang]);

    useEffect(() => {
        localStorage.setItem('googleSavedAccounts', JSON.stringify(savedAccounts));
    }, [savedAccounts]);

    useEffect(() => {
        localStorage.setItem('facebookSavedAccounts', JSON.stringify(facebookSavedAccounts));
    }, [facebookSavedAccounts]);

    useEffect(() => {
        localStorage.setItem('appleSavedAccounts', JSON.stringify(appleSavedAccounts));
    }, [appleSavedAccounts]);

    const translations = {
        EN: { title: 'Sign In', sub: 'Welcome back to nearbyme.lk', register: "Don't have an account?", regBtn: 'Sign Up', or: 'Or continue with', fields: { email: 'EMAIL ADDRESS', pass: 'PASSWORD' }, forgot: 'Forgot Password?', remember: 'Remember Me' },
        SI: { title: 'පුරනය වන්න', sub: 'nearbyme.lk වෙත නැවත සාදරයෙන් පිළිගනිමු', register: "ගිණුමක් නොමැතිද?", regBtn: 'ලියාපදිංචි වන්න', or: 'නැතහොත් මඟින් දිගටම කරගෙන යන්න', fields: { email: 'විද්‍යුත් තැපෑල', pass: 'මුරපදය' }, forgot: 'මුරපදය අමතක වූවාද?', remember: 'මතක තබා ගන්න' },
        TA: { title: 'உள்நுழைக', sub: 'nearbyme.lk இற்கு மீண்டும் வருக', register: "கணக்கு இல்லையா?", regBtn: 'பதிவு செய்யுங்கள்', or: 'அல்லது மூலம் தொடரவும்', fields: { email: 'மின்னஞ்சல் முகவரி', pass: 'கடவுச்சொல்' }, forgot: 'கடவுச்சொல் மறந்துவிட்டதா?', remember: 'என்னை நியாபகம் வை' }
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });

                const data = await response.json();

                if (response.ok && data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userRole', data.user.role);
                    localStorage.setItem('registeredUser', data.user.fullName);
                    localStorage.setItem('userEmail', data.user.email);

                    const userSpecificPointsKey = `userPoints_${data.user.email}`;
                    if (localStorage.getItem(userSpecificPointsKey) === null) {
                        localStorage.setItem(userSpecificPointsKey, '0');
                    }

                    showNotification('success', 'පුරනය වීම සාර්ථකයි! සාදරයෙන් පිළිගනිමු.');

                    setTimeout(() => {
                        if (data.user.role === 'admin') {
                            navigate('/admin/dashboard');
                        } else {
                            navigate('/welcome');
                        }
                    }, 1000);

                } else {
                    showNotification('error', data.message || data.error || 'Login failed');
                }
            } catch (error) {
                console.error("Login Error:", error);
                showNotification('error', 'සර්වර් එක සමඟ සම්බන්ධ වීම අසාර්ථකයි. කරුණාකර නැවත උත්සාහ කරන්න.');
            }
        }
    };

    const handleGoogleLoginTrigger = () => {
        if (savedAccounts.length > 0) {
            setIsGoogleModalOpen(true);
        } else {
            triggerRealGoogleLogin();
        }
    };

    const triggerRealGoogleLogin = () => {
        const CLIENT_ID = "434749338448-0gaqr0ado21jnr4obahie9nnp5t6d1un.apps.googleusercontent.com";

        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: CLIENT_ID,
                callback: async (response) => {
                    const userData = decodeJwt(response.credential);

                    try {
                        const backendRes = await fetch(`${API_BASE_URL}/api/auth/google-login`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                fullName: userData.name,
                                email: userData.email
                            })
                        });

                        const backendData = await backendRes.json();

                        if (backendRes.ok && backendData.token) {
                            localStorage.setItem('token', backendData.token);
                            localStorage.setItem('userRole', backendData.user?.role || 'user');
                            localStorage.setItem('userEmail', userData.email);

                            const userSpecificPointsKey = `userPoints_${userData.email}`;
                            if (localStorage.getItem(userSpecificPointsKey) === null) {
                                localStorage.setItem(userSpecificPointsKey, '0');
                            }

                            const newAccount = {
                                name: userData.name,
                                email: userData.email,
                                profilePic: userData.picture,
                                isSelected: true
                            };

                            setSavedAccounts(prev => {
                                const updated = prev.find(acc => acc.email === newAccount.email)
                                    ? prev : [...prev, newAccount];
                                localStorage.setItem('googleSavedAccounts', JSON.stringify(updated));
                                return updated;
                            });

                            setFormData(prev => ({ ...prev, email: userData.email }));
                            setIsGoogleModalOpen(false);
                            localStorage.setItem('registeredUser', userData.name);

                            showNotification('success', 'Google හරහා පුරනය වීම සාර්ථකයි!');

                            setTimeout(() => {
                                if (backendData.user?.role === 'admin') {
                                    navigate('/admin/dashboard');
                                } else {
                                    navigate('/welcome');
                                }
                            }, 1000);

                        } else {
                            showNotification('error', backendData.message || backendData.error || 'Backend synchronization failed');
                        }
                    } catch (err) {
                        console.error('Backend sync error:', err);
                        showNotification('error', 'සර්වර් එක සමඟ සම්බන්ධ වීමේ දෝෂයක් ඇති විය.');
                    }
                }
            });
            window.google.accounts.id.prompt();
        } else {
            showNotification('error', "Google Sign-In තවමත් ಲೋඩ් වෙමින් පවතී. කරුණාකර పేජ් එක Refresh කර නැවත උත්සාහ කරන්න.");
        }
    };

    const handleGoogleSelect = (account) => {
        setSavedAccounts(prev => prev.map(acc => ({
            ...acc,
            isSelected: acc.email === account.email
        })));

        setFormData(prev => ({ ...prev, email: account.email }));
        setIsGoogleModalOpen(false);
        localStorage.setItem('userEmail', account.email);

        const userSpecificPointsKey = `userPoints_${account.email}`;
        if (localStorage.getItem(userSpecificPointsKey) === null) {
            localStorage.setItem(userSpecificPointsKey, '0');
        }

        showNotification('success', 'ගිණුම තෝරාගැනීම සාර්ථකයි!');
        setTimeout(() => {
            const savedRole = localStorage.getItem('userRole') || 'user';
            if (savedRole === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/welcome');
            }
        }, 800);
    };

    const handleAddAccount = () => {
        setIsGoogleModalOpen(false);
        triggerRealGoogleLogin();
    };

    const handleFacebookLoginTrigger = () => {
        if (facebookSavedAccounts.length > 0) {
            setIsFacebookModalOpen(true);
        } else {
            triggerRealFacebookLogin();
        }
    };

    const triggerRealFacebookLogin = () => {
        if (window.FB) {
            window.FB.login((response) => {
                if (response.authResponse) {
                    window.FB.api('/me', { fields: 'name,email,picture' }, async (userInfo) => {
                        try {
                            const backendRes = await fetch(`${API_BASE_URL}/api/auth/facebook-login`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    fullName: userInfo.name,
                                    email: userInfo.email || `${userInfo.id}@facebook.com`,
                                    userID: userInfo.id
                                })
                            });

                            const backendData = await backendRes.json();

                            if (backendRes.ok && backendData.token) {
                                localStorage.setItem('token', backendData.token);
                                localStorage.setItem('userRole', backendData.user?.role || 'user');
                                localStorage.setItem('userEmail', userInfo.email || backendData.user.email);
                                localStorage.setItem('registeredUser', userInfo.name);

                                const newAccount = {
                                    name: userInfo.name,
                                    email: userInfo.email || `${userInfo.id}@facebook.com`,
                                    profilePic: userInfo.picture?.data?.url || "",
                                    isSelected: true
                                };

                                setFacebookSavedAccounts(prev => {
                                    const updated = prev.find(acc => acc.email === newAccount.email) ? prev : [...prev, newAccount];
                                    localStorage.setItem('facebookSavedAccounts', JSON.stringify(updated));
                                    return updated;
                                });

                                showNotification('success', 'Facebook හරහා පුරනය වීම සාර්ථකයි!');
                                setTimeout(() => navigate('/welcome'), 1000);
                            } else {
                                showNotification('error', backendData.message || 'Facebook login failed');
                            }
                        } catch (err) {
                            console.error('Facebook backend sync error:', err);
                        }
                    });
                } else {
                    showNotification('error', 'Facebook login was cancelled or not authorized.');
                }
            }, { scope: 'public_profile,email' });
        } else {
            showNotification('error', "Facebook SDK is not loaded yet.");
        }
    };

    const handleFacebookSelect = (account) => {
        setFacebookSavedAccounts(prev => prev.map(acc => ({
            ...acc,
            isSelected: acc.email === account.email
        })));
        setFormData(prev => ({ ...prev, email: account.email }));
        setIsFacebookModalOpen(false);
        localStorage.setItem('userEmail', account.email);
        showNotification('success', 'ගිණුම තෝරාගැනීම සාර්ථකයි!');
        setTimeout(() => navigate('/welcome'), 800);
    };

    const handleAppleLoginTrigger = () => {
        if (appleSavedAccounts.length > 0) {
            setIsAppleModalOpen(true);
        } else {
            triggerRealAppleLogin();
        }
    };

    const triggerRealAppleLogin = () => {
        const mockAppleUser = {
            name: "Apple User",
            email: "appleuser@example.com",
            picture: ""
        };

        fetch(`${API_BASE_URL}/api/auth/apple-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName: mockAppleUser.name, email: mockAppleUser.email })
        })
            .then(res => res.json())
            .then(backendData => {
                if (backendData.token) {
                    localStorage.setItem('token', backendData.token);
                    localStorage.setItem('userRole', backendData.user?.role || 'user');
                    localStorage.setItem('userEmail', mockAppleUser.email);
                    localStorage.setItem('registeredUser', mockAppleUser.name);

                    const newAccount = { ...mockAppleUser, isSelected: true };
                    setAppleSavedAccounts(prev => {
                        const updated = prev.find(acc => acc.email === newAccount.email) ? prev : [...prev, newAccount];
                        return updated;
                    });

                    showNotification('success', 'Apple හරහා පුරනය වීම සාර්ථකයි!');
                    setTimeout(() => navigate('/welcome'), 1000);
                } else {
                    showNotification('error', backendData.message || 'Apple login failed');
                }
            }).catch(err => {
            console.error("Apple login error:", err);
            showNotification('error', "සර්වර් එක සමඟ සම්බන්ධ වීම අසාර්ථකයි.");
        });
    };

    const iconsData = [
        { Icon: FaSuitcaseRolling, size: 80, delay: 0 },
        { Icon: FaSuitcaseRolling, size: 40, delay: 5 },
        { Icon: FaPassport, size: 60, delay: 2 },
        { Icon: FaCamera, size: 50, delay: 4 },
        { Icon: GiPalmTree, size: 100, delay: 1 },
        { Icon: GiPalmTree, size: 70, delay: 7 },
        { Icon: FaCompass, size: 120, delay: 3 },
    ];

    const particles = Array.from({ length: 20 });
    const t = translations[lang];

    return (
        <div className={`min-h-screen w-full flex items-center justify-center p-4 md:p-10 font-poppins relative overflow-hidden transition-all duration-500 ${mode === 'dark' ? 'bg-theme-grad' : 'bg-slate-50'}`}>

            {/* Custom Floating Toast Notification */}
            {message.text && (
                <div className="fixed top-6 right-6 z-50 animate-bounce">
                    <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-white font-medium shadow-2xl border ${
                        message.type === 'error'
                            ? 'bg-rose-600/90 border-rose-500 shadow-rose-900/50'
                            : 'bg-emerald-600/90 border-emerald-500 shadow-emerald-900/50'
                    } backdrop-blur-md`}>
                        {message.type === 'error' ? <FaExclamationTriangle size={18} /> : <FaCheckCircle size={18} />}
                        <span className="text-sm">{message.text}</span>
                    </div>
                </div>
            )}

            <GoogleAccountModal
                isOpen={isGoogleModalOpen}
                onClose={() => setIsGoogleModalOpen(false)}
                onSelect={handleGoogleSelect}
                savedAccounts={savedAccounts}
                onAddAccount={handleAddAccount}
            />

            <AnimatePresence>
                {mode === 'dark' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 z-0 opacity-10">
                            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                                <svg className="relative block w-[calc(100%+1.3px)] h-[150px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                                    <motion.path animate={{ x: [-10, 10, -10] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white/30"/>
                                </svg>
                            </div>
                        </div>
                        {particles.map((_, i) => (
                            <motion.div key={`particle-${i}`} className="absolute rounded-full bg-white/15 z-0" initial={{ width: Math.random() * 6 + 2, height: Math.random() * 6 + 2, x: Math.random() * 100 + "%", y: Math.random() * 100 + "%", opacity: Math.random() * 0.1 + 0.1 }} animate={{ y: ["-10%", "110%"], x: ["0%", (Math.random() * 20 - 10) + "%"], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "linear" }} />
                        ))}
                        {iconsData.map((item, i) => (
                            <motion.div key={`icon-${i}`} className="absolute text-white/10 z-0" initial={{ x: (i * 15 + Math.random() * 10) + "%", y: (i * 12 + Math.random() * 10) + "%", rotate: Math.random() * 360 }} animate={{ y: ["-5%", "5%"], rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }} transition={{ duration: Math.random() * 5 + 8, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}>
                                <item.Icon size={item.size} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className={`relative flex flex-col lg:flex-row w-full max-w-5xl rounded-[3rem] border shadow-2xl overflow-hidden transition-all duration-500 ${mode === 'dark' ? 'bg-white/10 backdrop-blur-2xl border-white/20' : 'bg-white/80 backdrop-blur-md border-slate-200'}`}
            >
                <div className="w-full lg:w-3/5 p-8 md:p-14 flex flex-col justify-center relative">
                    <div className="absolute top-6 left-8 right-8 flex justify-between items-center z-30">
                        <div className="flex gap-2">
                            {[{ code: 'SI', label: 'සි' }, { code: 'EN', label: 'EN' }, { code: 'TA', label: 'த' }].map(({ code, label }) => (
                                <button key={code} onClick={() => setLang(code)} className={`px-3 py-1.5 text-[10px] font-bold rounded-full border transition-all ${lang === code ? 'bg-theme-btn text-white border-transparent' : mode === 'dark' ? 'bg-white/5 border-white/10 text-teal-200 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}>{label}</button>
                            ))}
                        </div>
                        <div className="flex gap-3 items-center">
                            <div className="flex gap-1.5 p-1 bg-black/10 rounded-full backdrop-blur-sm border border-white/5">
                                <button onClick={() => setTheme('theme-blue')} className={`w-3.5 h-3.5 rounded-full bg-blue-500 transition-transform ${theme === 'theme-blue' ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-transparent' : 'opacity-60 hover:opacity-100'}`} title="Blue Theme" />
                                <button onClick={() => setTheme('theme-green')} className={`w-3.5 h-3.5 rounded-full bg-emerald-500 transition-transform ${theme === 'theme-green' ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-transparent' : 'opacity-60 hover:opacity-100'}`} title="Green Theme" />
                                <button onClick={() => setTheme('theme-purple')} className={`w-3.5 h-3.5 rounded-full bg-purple-500 transition-transform ${theme === 'theme-purple' ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-transparent' : 'opacity-60 hover:opacity-100'}`} title="Purple Theme" />
                            </div>
                            <button className={`p-2 rounded-full transition-all ${mode === 'dark' ? 'bg-white/5 text-yellow-400 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`} onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>{mode === 'dark' ? <FaSun size={14} /> : <FaMoon size={14} />}</button>
                        </div>
                    </div>

                    <div className="mb-10 mt-6 text-center lg:text-left">
                        <motion.h2 className={`text-4xl font-bold mb-2 ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t.title}</motion.h2>
                        <p className={`text-sm font-medium uppercase tracking-widest ${mode === 'dark' ? 'text-teal-200 opacity-60' : 'text-slate-500'}`}>{t.sub}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <InputLine icon={<FaEnvelope />} label={t.fields.email} name="email" type="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} error={errors.email} mode={mode} />

                        <div className="relative">
                            <InputLine icon={<FaLock />} label={t.fields.pass} name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={handleChange} error={errors.password} mode={mode} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 bottom-2 text-teal-300/50 hover:text-teal-300 p-2"><AnimatePresence mode="wait">{showPassword ? <motion.div key="eye-slash" initial={{scale:0}} animate={{scale:1}}><FaEyeSlash size={14}/></motion.div> : <motion.div key="eye" initial={{scale:0}} animate={{scale:1}}><FaEye size={14}/></motion.div>}</AnimatePresence></button>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer opacity-70">
                                <input type="checkbox" className={`w-4 h-4 rounded border-transparent ${mode === 'dark' ? 'bg-white/10 text-theme-btn' : 'bg-slate-100 text-slate-900'}`} />
                                <span className={mode === 'dark' ? 'text-white' : 'text-slate-600'}>{t.remember}</span>
                            </label>
                            <Link to="/forgot-password" className={`font-bold hover:underline ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t.forgot}</Link>
                        </div>

                        <div className="pt-4 flex flex-col items-center">
                            <button type="submit" className="w-full py-4 rounded-xl bg-theme-btn text-white font-bold text-lg shadow-xl hover:brightness-110 transition-all transform hover:scale-[1.02] active:scale-[0.98]">Login</button>

                            <div className="mt-6 flex flex-col items-center gap-4 w-full">
                                <div className="flex items-center gap-4 w-full px-4 opacity-30">
                                    <div className={`h-px flex-grow ${mode === 'dark' ? 'bg-white' : 'bg-slate-900'}`}></div>
                                    <span className="text-[10px] uppercase font-bold tracking-widest">{t.or}</span>
                                    <div className={`h-px flex-grow ${mode === 'dark' ? 'bg-white' : 'bg-slate-900'}`}></div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleGoogleLoginTrigger}
                                    className={`w-full h-[52px] border rounded-xl flex items-center justify-center gap-3 px-6 transition-all duration-200 group shadow-sm active:scale-[0.98] ${
                                        mode === 'dark'
                                            ? 'bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-md'
                                            : 'bg-white border-[#e0e0e0] text-[#5f6368] hover:bg-[#f5f5f5]'
                                    }`}
                                >
                                    <FaGoogle className="text-[#4285F4] text-xl shrink-0" />
                                    <span className={`text-[16px] font-medium ${mode === 'dark' ? 'text-white' : 'text-[#5f6368]'}`}>Continue with Google</span>
                                </button>

                                <div className="flex gap-4 w-full">
                                    <button
                                        type="button"
                                        onClick={handleFacebookLoginTrigger}
                                        className={`flex-1 h-[52px] border rounded-xl flex items-center justify-center gap-3 px-4 transition-all duration-200 group shadow-sm active:scale-[0.98] ${
                                            mode === 'dark'
                                                ? 'bg-white/10 border-white/25 text-white hover:bg-white/20 backdrop-blur-md'
                                                : 'bg-white border-[#e0e0e0] text-[#5f6368] hover:bg-[#f5f5f5]'
                                        }`}
                                    >
                                        <FaFacebook className="text-[#1877F2] text-xl shrink-0" />
                                        <span className={`text-[15px] font-medium truncate ${mode === 'dark' ? 'text-white' : 'text-[#5f6368]'}`}>Facebook</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleAppleLoginTrigger}
                                        className={`flex-1 h-[52px] border rounded-xl flex items-center justify-center gap-3 px-4 transition-all duration-200 group shadow-sm active:scale-[0.98] ${
                                            mode === 'dark'
                                                ? 'bg-white/10 border-white/25 text-white hover:bg-white/20 backdrop-blur-md'
                                                : 'bg-white border-[#e0e0e0] text-[#5f6368] hover:bg-[#f5f5f5]'
                                        }`}
                                    >
                                        <FaApple className={`${mode === 'dark' ? 'text-white' : 'text-[#202124]'} text-xl shrink-0`} />
                                        <span className={`text-[15px] font-medium truncate ${mode === 'dark' ? 'text-white' : 'text-[#5f6368]'}`}>Apple</span>
                                    </button>
                                </div>

                            </div>

                            <p className="mt-8 text-sm font-medium opacity-70">
                                {t.register} <Link to="/register" className={`font-bold hover:underline ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t.regBtn}</Link>
                            </p>
                        </div>
                    </form>
                </div>

                <div className={`hidden lg:flex w-2/5 relative items-center justify-center p-12 ${mode === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                    <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="w-full relative z-10">
                        <div className={`rounded-[3rem] p-4 border shadow-2xl ${mode === 'dark' ? 'bg-white/5 backdrop-blur-md border-white/10' : 'bg-white border-slate-200'}`}>
                            <img src={bluePlantIllustration} alt="Illustration" className="w-full rounded-[2.5rem] opacity-90 shadow-inner" />
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

const InputLine = ({ icon, label, name, type, placeholder, value, onChange, error, mode }) => (
    <div className="relative pb-1 group flex flex-col">
        <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 mb-1 transition-colors ${error ? 'text-red-400' : mode === 'dark' ? 'text-teal-300' : 'text-slate-500'}`}>{label}</label>
        <div className={`flex items-center gap-3 border-b-2 transition-all ${error ? 'border-red-400/50' : mode === 'dark' ? 'border-white/10 focus-within:border-teal-400' : 'border-slate-200 focus-within:border-slate-400'}`}>
            <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} className={`w-full bg-transparent font-medium py-2 focus:outline-none placeholder:opacity-30 ${mode === 'dark' ? 'text-white placeholder:text-white' : 'text-slate-900 placeholder:text-slate-400'}`} />
            <div className={`transition-colors pr-1 ${error ? 'text-red-400' : mode === 'dark' ? 'text-teal-300/40 group-focus-within:text-teal-300' : 'text-slate-400 group-focus-within:text-slate-600'}`}>{icon}</div>
        </div>
        <AnimatePresence>{error && <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-[10px] text-red-400 mt-1 font-bold pl-1">{error}</motion.span>}</AnimatePresence>
    </div>
);

export default Login;