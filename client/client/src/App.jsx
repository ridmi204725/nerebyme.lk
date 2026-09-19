import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Loading from './pages/Loading';
import Register from './pages/Register';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import FoodHub from './pages/FoodHub';
import Dayout from './pages/Dayout';
import Travel from './pages/Travel';
import OffersPage from './pages/OffersPage';
import Functions from './pages/Functions'; // 🆕 Functions Page එක Import කිරීම
import MovieTheaters from './pages/MovieTheaters'; // 🆕 Movie Theaters Page

import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import MainLayout from './components/MainLayout';
import { AnimatePresence } from 'framer-motion';

function App() {
  const location = useLocation(); // Required for AnimatePresence to track route changes

  return (
    <div className="App font-poppins overflow-x-hidden min-h-screen">

      {/* AnimatePresence is used to provide smooth transitions during page routing */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          {/* ── AUTH / STANDALONE PAGES ── */}
          <Route path="/" element={<Navigate to="/loading" />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/register" element={<Register />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
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

          {/* ── SHARED NAVIGATION LAYOUT PAGES (NAVBAR & FOOTER) ── */}
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/food-hub" element={<FoodHub />} />
            <Route path="/dayout" element={<Dayout />} />
            <Route path="/travel" element={<Travel />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/functions" element={<Functions />} />
            <Route path="/movie-theaters" element={<MovieTheaters />} />

            {/* 🎬 Mapped to Home page to prevent the app from crashing until Movie Theaters page is fully built */}
            <Route path="/movie-theaters" element={<Home />} />
          </Route>

          {/* Redirects directly to Home if any invalid URL is entered */}
          <Route path="*" element={<Navigate to="/home" />} />

        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;