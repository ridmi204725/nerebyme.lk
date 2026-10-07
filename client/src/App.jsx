import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Loading from './pages/Loading';
import Register from './pages/Register';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import FoodHub from './pages/FoodHub';
import Hotels from './pages/Hotels';
import Dayout from './pages/Dayout';
import Travel from './pages/Travel';
import OffersPage from './pages/OffersPage';
import Functions from './pages/Functions';
import MovieTheaters from './pages/MovieTheaters';
import SellerDashboard from './pages/SellerDashboard';
import AccountSettings from './pages/AccountSettings';
import MyOffers from './pages/MyOffers';
import PlayAndEarn from './pages/PlayAndEarn';
import Advertise from './pages/Advertise';
import FaqHelp from './pages/FaqHelp';
import AboutUs from './pages/AboutUs';
import Feedback from './pages/Feedback';

// ── Imports for Details & Edit pages ──
import EditPlace from './pages/EditPlacePage';
import DetailsFood from './pages/DetailsFood';
import DetailsHotel from './pages/DetailsHotel';
import DetailsDayout from './pages/DetailsDayout';
import DetailsTravel from './pages/DetailsTravel';
import DetailsMovie from './pages/DetailsMovie';
import DetailsFunction from './pages/DetailsFunction';
import AdminContentManager from './pages/AdminContentManager'; // Movie Details පිටුව මෙහි ඉම්පෝට් කර ඇත[cite: 13]
import EditPlacePage from './pages/EditPlacePage';

import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import SellerRoute from './components/SellerRoute';
import RegistrationGate from './components/RegistrationGate';
import GlobalNotification from './components/GlobalNotification';
import MainLayout from './components/MainLayout';
import { AnimatePresence } from 'framer-motion';

function App() {
    const location = useLocation();
    const [mode, setMode] = useState(localStorage.getItem('mode') || 'dark');

    // Listen to mode changes from localStorage or custom events if needed
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

    useEffect(() => {
        document.documentElement.setAttribute('data-mode', mode);
        document.body.setAttribute('data-mode', mode);
        document.documentElement.setAttribute('data-theme', localStorage.getItem('selectedTheme') || 'theme-blue');
    }, [mode]);

    const isDark = mode === 'dark';

    return (
        <div className={`App font-poppins overflow-x-hidden min-h-screen ${isDark ? 'bg-[#0b0e14] text-white' : 'bg-gray-50 text-gray-900'}`}>
            <GlobalNotification />
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>

                    {/* ── AUTH / STANDALONE PAGES ── */}
                    <Route path="/" element={<Navigate to="/loading" />} />
                    <Route path="/loading" element={<Loading />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/welcome" element={<Welcome />} />
                    <Route path="/login" element={<Login />}    />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* ── PROTECTED ADMIN ROUTES ── */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/content"
                        element={
                            <AdminRoute>
                                <AdminContentManager />
                            </AdminRoute>
                        }
                    />

                    {/* ── EDIT PLACE ROUTES ── */}
                    <Route
                        path="/edit-place"
                        element={
                            <AdminRoute>
                                <EditPlace />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/edit-place/:id"
                        element={
                            <AdminRoute>
                                <EditPlace />
                            </AdminRoute>
                        }
                    />
                    {/* Edit Route */}
                    <Route
                        path="/admin/edit-item/:id"
                        element={
                            <AdminRoute>
                                <EditPlacePage />
                            </AdminRoute>
                        }
                    />

                    {/* ── SHARED NAVIGATION LAYOUT PAGES (NAVBAR & FOOTER) ── */}
                    <Route element={<MainLayout />}>
                        {/* Home is intentionally public: a brand-new visitor always lands here first. */}
                        <Route path="/home" element={<Home />} />

                        {/* Every page after Home requires an authenticated/registered account. */}
                        <Route element={<RegistrationGate />}>
                            <Route path="/food-hub" element={<FoodHub />} />
                            <Route path="/hotels" element={<Hotels />} />
                            <Route path="/dayout" element={<Dayout />} />
                            <Route path="/travel" element={<Travel />} />
                            <Route path="/offers" element={<OffersPage />} />
                            <Route path="/functions" element={<Functions />} />
                            <Route path="/movie-theaters" element={<MovieTheaters />} />

                            <Route path="/account" element={<AccountSettings />} />
                            <Route path="/my-offers" element={<MyOffers />} />
                            <Route path="/play-and-earn" element={<PlayAndEarn />} />
                            <Route path="/advertise" element={<Advertise />} />
                            <Route path="/faq-help" element={<FaqHelp />} />
                            <Route path="/about-us" element={<AboutUs />} />
                            <Route path="/feedback" element={<Feedback />} />

                            <Route path="/place/:id" element={<DetailsFood />} />
                            <Route path="/foodhub/:id" element={<DetailsFood />} />
                            <Route path="/hotels/:id" element={<DetailsHotel />} />
                            <Route path="/dayout/:id" element={<DetailsDayout />} />
                            <Route path="/travel/:id" element={<DetailsTravel />} />
                            <Route path="/movie-theater/:id" element={<DetailsMovie />} />
                            <Route path="/functions/:id" element={<DetailsFunction />} />

                            <Route
                                path="/seller/dashboard"
                                element={
                                    <SellerRoute>
                                        <SellerDashboard />
                                    </SellerRoute>
                                }
                            />
                        </Route>
                    </Route>

                    {/* Redirects directly to Home if any invalid URL is entered */}
                    <Route path="*" element={<Navigate to="/home" />} />

                </Routes>
            </AnimatePresence>
        </div>
    );
}

export default App;