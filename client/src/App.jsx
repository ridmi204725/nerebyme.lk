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
import EditPlacePage from './pages/EditPlacePage';

import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import SellerRoute from './components/SellerRoute';
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

    const isDark = mode === 'dark';

    return (
        <div className={`App font-poppins overflow-x-hidden min-h-screen ${isDark ? 'bg-[#0b0e14] text-white' : 'bg-gray-50 text-gray-900'}`}>
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
                        <Route path="/home" element={<Home />} />
                        <Route path="/food-hub" element={<FoodHub />} />
                        <Route path="/hotels" element={<Hotels />} />
                        <Route path="/dayout" element={<Dayout />} />
                        <Route path="/travel" element={<Travel />} />
                        <Route path="/offers" element={<OffersPage />} />
                        <Route path="/functions" element={<Functions />} />
                        <Route path="/movie-theaters" element={<MovieTheaters />} />

                        {/* ── NEW PAGES ── */}
                        <Route path="/account" element={<AccountSettings />} />
                        <Route path="/my-offers" element={<MyOffers />} />
                        <Route path="/play-and-earn" element={<PlayAndEarn />} />
                        <Route path="/advertise" element={<Advertise />}  />
                        <Route path="/faq-help" element={<FaqHelp />} />
                        <Route path="/about-us" element={<AboutUs />} />
                        <Route path="/feedback" element={<Feedback />} />

                        {/* ── DETAILS PAGES ── */}
                        <Route path="/place/:id" element={<DetailsFood />} />
                        <Route path="/foodhub/:id" element={<DetailsFood />} />

                        {/* Hotels Routes */}
                        <Route path="/hotels/:id" element={<DetailsHotel />} />

                        {/* Dayout Routes */}
                        <Route path="/dayout/:id" element={<DetailsDayout />} />

                        {/* Travel Routes */}
                        <Route path="/travel/:id" element={<DetailsTravel />} />

                        <Route path="/movie-theaters/:id" element={<DetailsFood />} />
                        <Route path="/functions/:id" element={<DetailsFood />} />

                        {/* ── PROTECTED SELLER ROUTE ── */}
                        <Route
                            path="/seller/dashboard"
                            element={
                                <SellerRoute>
                                    <SellerDashboard />
                                </SellerRoute>
                            }
                        />
                    </Route>

                    {/* Redirects directly to Home if any invalid URL is entered */}
                    <Route path="*" element={<Navigate to="/home" />} />

                </Routes>
            </AnimatePresence>
        </div>
    );
}

export default App;