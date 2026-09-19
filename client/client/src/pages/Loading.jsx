import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import loadingBg from '../assets/loading-bg.png';
import loadingBgMobile from '../assets/loading-bg-mobile.png';

const Loading = () => {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);

        // 🌟 Register වුණාට පස්සේ default එක ලෙස කෙලින්ම '/login' පිටුවට යන්න සකස් කර ඇත.
        const nextPath = queryParams.get('to') || '/login';

        const interval = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    clearInterval(interval);
                    return 100;
                }
                const diff = Math.random() * 20;
                return Math.min(oldProgress + diff, 100);
            });
        }, 300);

        const timer = setTimeout(() => {
            navigate(nextPath);
        }, 3000);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [navigate]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url(${isMobile ? loadingBgMobile : loadingBg})`,
                    backgroundSize: isMobile ? 'contain' : 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: isMobile ? '#0d4b8e' : 'transparent',
                }}
            >
                <div className="absolute inset-0 bg-black/30"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
                <div className="flex gap-4 mb-4">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                            key={i}
                            className="w-5 h-5 bg-white rounded-full shadow-lg"
                            animate={{
                                opacity: [0.3, 1, 0.3],
                                scale: [0.8, 1.2, 0.8]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.15
                            }}
                        />
                    ))}
                </div>
                <p className="text-white text-xs font-semibold tracking-widest uppercase opacity-60">Loading {Math.round(progress)}%</p>
            </div>
        </motion.div>
    );
};

export default Loading;