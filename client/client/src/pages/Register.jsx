import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaSuitcaseRolling, FaPassport, FaCamera, FaCompass, FaGoogle, FaFacebook, FaApple, FaMoon, FaSun, FaCalendarAlt } from 'react-icons/fa';
import { GiPalmTree } from 'react-icons/gi';
import bluePlantIllustration from '../assets/blue-plant-illustration.png';
import GoogleAccountModal from '../components/GoogleAccountModal';

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [mode, setMode] = useState(localStorage.getItem('mode') || 'dark');
    const [theme, setTheme] = useState(localStorage.getItem('selectedTheme') || 'theme-blue');
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'EN');

    // Google Account Modal State
    const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
    const [savedAccounts, setSavedAccounts] = useState(() => {
        const saved = localStorage.getItem('googleSavedAccounts');
        return saved ? JSON.parse(saved) : [];
    });


    const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:5001`;

    // Helper to decode Google JWT
    const decodeJwt = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    };

    const [formData, setFormData] = useState({
        fullName: '',
        birthday: '',
        contactNo: '',
        email: '',
        password: '',
        confirmPassword: ''
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

    const translations = {
        EN: { title: 'Sign Up', sub: 'Start your journey today', login: 'Already Have Account?', loginBtn: 'Login', or: 'Or continue with', fields: { name: 'FULL NAME', bday: 'BIRTHDAY', contact: 'CONTACT NO', email: 'EMAIL', pass: 'PASSWORD', cpass: 'CONFIRM PASSWORD' } },
        SI: { title: 'ලියාපදිංචි වන්න', sub: 'අදම ඔබේ ගමන ආරම්භ කරන්න', login: 'දැනටමත් ගිණුමක් තිබේද?', loginBtn: 'පුරනය වන්න', or: 'නැතහොත් මඟින් දිගටම කරගෙන යන්න', fields: { name: 'සම්පූර්ණ නම', bday: 'උපන් දිනය', contact: 'දුරකථන අංකය', email: 'විද්‍යුත් තැපෑල', pass: 'මුරපදය', cpass: 'මුරපදය තහවුරු කරන්න' } },
        TA: { title: 'பதிவு செய்யுங்கள்', sub: 'இன்று உங்கள் பயணத்தைத் தொடங்குங்கள்', login: 'ஏற்கனவே கணக்கு உள்ளதா?', loginBtn: 'உள்நுழைக', or: 'அல்லது மூலம் தொடரவும்', fields: { name: 'முழு பெயர்', bday: 'பிறந்த நாள்', contact: 'தொடர்பு எண்', email: 'மின்னஞ்சல்', pass: 'கடவுச்சொல்', cpass: 'கடவுச்சொல்லை உறுதிப்படுத்தவும்' } }
    };

    const validate = () => {
        let newErrors = {};

        if (!formData.fullName) {
            newErrors.fullName = 'Full Name is required';
        } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
            newErrors.fullName = 'Should only contain letters and spaces';
        } else if (formData.fullName.length < 3) {
            newErrors.fullName = 'Minimum length: 3 characters';
        }

        if (!formData.birthday) {
            newErrors.birthday = 'Birthday is required';
        } else {
            const birthDate = new Date(formData.birthday);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18) {
                newErrors.birthday = 'User must be at least 18 years old';
            }
        }

        if (!formData.contactNo) {
            newErrors.contactNo = 'Contact Number is required';
        } else if (!/^0\d{9}$/.test(formData.contactNo)) {
            newErrors.contactNo = 'Enter a valid 10-digit number (e.g., 0771234567)';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Minimum 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
            newErrors.password = 'Must contain: 1 uppercase, 1 lowercase, 1 number, 1 special character';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirm Password is required';
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Must exactly match the Password';
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
                const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fullName: formData.fullName,
                        email: formData.email,
                        phone: formData.contactNo,
                        birthday: formData.birthday,
                        password: formData.password
                    })
                });

                const data = await response.json();

                if (data.success) {
                    localStorage.setItem('registeredUser', formData.fullName);

                    // 🌟 අලුතින් Register වන කෙනාගේ Email එක සේව් කර, ලකුණු Key එක 0 ලෙස සකස් කරයි
                    localStorage.setItem('userEmail', formData.email);
                    const userSpecificPointsKey = `userPoints_${formData.email}`;
                    localStorage.setItem(userSpecificPointsKey, '0');

                    // Loading Screen එක හරහා නිවැරදිව Login පිටුවට Redirect කරයි
                    navigate('/loading?to=/login');
                } else {
                    alert(data.error || 'Registration failed');
                }
            } catch (error) {
                console.error("Registration Error:", error);
                alert('Connection to server failed. Please try again.');
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

                        if (backendData.success) {
                            localStorage.setItem('token', backendData.token);
                            localStorage.setItem('userRole', backendData.user?.role || 'user');

                            // 🌟 Google හරහා අලුතින් එන කෙනාගේ Email එක සේව් කර, ලකුණු 0 කරයි
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

                            setFormData(prev => ({
                                ...prev,
                                fullName: userData.name,
                                email: userData.email
                            }));

                            setIsGoogleModalOpen(false);
                            localStorage.setItem('registeredUser', userData.name);
                            setTimeout(() => navigate('/loading?to=/login'), 800);
                        } else {
                            alert(backendData.error || 'Backend synchronization failed');
                        }
                    } catch (err) {
                        console.error('Backend sync error:', err);
                    }
                }
            });
            window.google.accounts.id.prompt();
        } else {
            alert("Google Sign-In is still loading. Please refresh and try again.");
        }
    };

    const handleGoogleSelect = (account) => {
        setSavedAccounts(prev => prev.map(acc => ({
            ...acc,
            isSelected: acc.email === account.email
        })));

        setFormData(prev => ({
            ...prev,
            fullName: account.name,
            email: account.email
        }));

        setIsGoogleModalOpen(false);
        localStorage.setItem('registeredUser', account.name);

        // 🌟 Saved list එකෙන් තෝරද්දීත් අදාළ Email එකට Points Key එකක් සාදයි
        localStorage.setItem('userEmail', account.email);
        const userSpecificPointsKey = `userPoints_${account.email}`;
        if (localStorage.getItem(userSpecificPointsKey) === null) {
            localStorage.setItem(userSpecificPointsKey, '0');
        }

        setTimeout(() => navigate('/loading?to=/login'), 800);
    };

    const handleAddAccount = () => {
        setIsGoogleModalOpen(false);
        triggerRealGoogleLogin();
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

                    <div className="mb-8 mt-6 text-center lg:text-left">
                        <motion.h2 className={`text-4xl font-bold mb-2 ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t.title}</motion.h2>
                        <p className={`text-sm font-medium uppercase tracking-widest ${mode === 'dark' ? 'text-teal-200 opacity-60' : 'text-slate-500'}`}>{t.sub}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InputLine icon={<FaUser />} label={t.fields.name} name="fullName" type="text" placeholder="Your Name" value={formData.fullName} onChange={handleChange} error={errors.fullName} mode={mode} />
                            <InputLine icon={<FaCalendarAlt />} label={t.fields.bday} name="birthday" type="date" value={formData.birthday} onChange={handleChange} error={errors.birthday} mode={mode} max={new Date().toISOString().split('T')[0]} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InputLine icon={<FaPhone />} label={t.fields.contact} name="contactNo" type="tel" placeholder="0xx xxx xxx" value={formData.contactNo} onChange={handleChange} error={errors.contactNo} mode={mode} />
                            <InputLine icon={<FaEnvelope />} label={t.fields.email} name="email" type="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} error={errors.email} mode={mode} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="relative">
                                <InputLine icon={<FaLock />} label={t.fields.pass} name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={handleChange} error={errors.password} mode={mode} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 bottom-2 text-teal-300/50 hover:text-teal-300 p-2"><AnimatePresence mode="wait">{showPassword ? <motion.div key="eye-slash" initial={{scale:0}} animate={{scale:1}}><FaEyeSlash size={14}/></motion.div> : <motion.div key="eye" initial={{scale:0}} animate={{scale:1}}><FaEye size={14}/></motion.div>}</AnimatePresence></button>
                            </div>
                            <InputLine icon={<FaLock />} label={t.fields.cpass} name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} mode={mode} />
                        </div>

                        <div className="pt-4 flex flex-col items-center">
                            <button type="submit" className="w-full py-4 rounded-xl bg-theme-btn text-white font-bold text-lg shadow-xl hover:brightness-110 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                                {t.title}
                            </button>

                            <div className="mt-6 flex flex-col items-center gap-4 w-full">
                                <div className="flex items-center gap-4 w-full px-4 opacity-30">
                                    <div className={`h-px flex-grow ${mode === 'dark' ? 'bg-white' : 'bg-slate-900'}`}></div>
                                    <span className="text-[10px] uppercase font-bold tracking-widest">{t.or}</span>
                                    <div className={`h-px flex-grow ${mode === 'dark' ? 'bg-white' : 'bg-slate-900'}`}></div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleGoogleLoginTrigger}
                                    className="w-full h-[52px] bg-white border border-[#e0e0e0] rounded-xl flex items-center justify-center gap-3 px-6 hover:bg-[#f5f5f5] transition-all duration-200 group shadow-sm active:scale-[0.98]"
                                >
                                    <FaGoogle className="text-[#4285F4] text-xl" />
                                    <span className="text-[16px] font-medium text-[#5f6368]">Continue with Google</span>
                                </button>

                                <div className="flex justify-center gap-4">
                                    <SocialButton icon={<FaFacebook className="text-[#1877F2]" />} mode={mode} />
                                    <SocialButton icon={<FaApple className={mode === 'dark' ? 'text-white' : 'text-[#202124]'} />} mode={mode} />
                                </div>
                            </div>

                            <p className="mt-8 text-sm font-medium opacity-70">
                                {t.login} <Link to="/login" className={`font-bold hover:underline ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t.loginBtn}</Link>
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

const SocialButton = ({ icon, mode, onClick }) => (
    <button type="button" onClick={onClick} className={`p-3.5 border rounded-2xl transition-all transform hover:scale-110 active:scale-90 text-xl shadow-sm ${mode === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
        {icon}
    </button>
);

const InputLine = ({ icon, label, name, type, placeholder, value, onChange, error, mode, ...props }) => (
    <div className="relative pb-1 group flex flex-col">
        <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 mb-1 transition-colors ${error ? 'text-red-400' : mode === 'dark' ? 'text-teal-300' : 'text-slate-500'}`}>{label}</label>
        <div className={`flex items-center gap-3 border-b-2 transition-all ${error ? 'border-red-400/50' : mode === 'dark' ? 'border-white/10 focus-within:border-teal-400' : 'border-slate-200 focus-within:border-slate-400'}`}>
            <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} className={`w-full bg-transparent font-medium py-2 focus:outline-none placeholder:opacity-30 ${mode === 'dark' ? 'text-white placeholder:text-white' : 'text-slate-900 placeholder:text-slate-400'}`} {...props} />
            <div className={`transition-colors pr-1 ${error ? 'text-red-400' : mode === 'dark' ? 'text-teal-300/40 group-focus-within:text-teal-300' : 'text-slate-400 group-focus-within:text-slate-600'}`}>{icon}</div>
        </div>
        <AnimatePresence>
            {error && <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-[10px] text-red-400 mt-1 font-bold pl-1">{error}</motion.span>}
        </AnimatePresence>
    </div>
);

export default Register;