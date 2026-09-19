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
            {/* Background Image with Overlay (Unchanged) */}
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

            {/* Custom CSS Loader & Progress Text */}
            <div className="relative z-10 flex flex-col items-center">
                <div className="loader mb-6">
                    <div className="inner one"></div>
                    <div className="inner two"></div>
                    <div className="inner three"></div>
                </div>
                <p className="text-white text-xs font-semibold tracking-widest uppercase opacity-80 mt-16">
                    Loading {Math.round(progress)}%
                </p>
            </div>

            {/* Injected CSS for the custom loader */}
            <style>{`
                .loader {
                    position: relative;
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    perspective: 800px;
                }
                .inner {
                    position: absolute;
                    box-sizing: border-box;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;  
                }
                .inner.one {
                    left: 0%;
                    top: 0%;
                    animation: rotate-one 1s linear infinite;
                    border-bottom: 3px solid #EFEFFA;
                }
                .inner.two {
                    right: 0%;
                    top: 0%;
                    animation: rotate-two 1s linear infinite;
                    border-right: 3px solid #EFEFFA;
                }
                .inner.three {
                    right: 0%;
                    bottom: 0%;
                    animation: rotate-three 1s linear infinite;
                    border-top: 3px solid #EFEFFA;
                }
                @keyframes rotate-one {
                    0% {
                        transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
                    }
                    100% {
                        transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
                    }
                }
                @keyframes rotate-two {
                    0% {
                        transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
                    }
                    100% {
                        transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
                    }
                }
                @keyframes rotate-three {
                    0% {
                        transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
                    }
                    100% {
                        transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
                    }
                }
            `}</style>
        </motion.div>
    );
};

export default Loading;