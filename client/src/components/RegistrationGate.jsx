import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../utils/api';

const RegistrationGate = ({ children }) => {
  const location = useLocation();
  const [state, setState] = useState('checking');

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem('token');

    if (!token) {
      const hasRegisteredIdentity = Boolean(localStorage.getItem('registeredUser') && localStorage.getItem('userEmail'));
      const hasVisitedHome = localStorage.getItem('homeVisited') === 'true';
      setState(hasRegisteredIdentity ? 'login' : hasVisitedHome ? 'register' : 'home');
      return () => { cancelled = true; };
    }

    fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) throw new Error(data.message || 'Session expired');
        if (cancelled) return;
        const user = data.user || {};
        localStorage.setItem('registeredUser', user.fullName || localStorage.getItem('registeredUser') || 'Traveler');
        localStorage.setItem('userEmail', user.email || localStorage.getItem('userEmail') || '');
        localStorage.setItem('userRole', user.role || 'user');
        setState('allow');
      })
      .catch(() => {
        localStorage.removeItem('token');
        if (!cancelled) {
          const hasRegisteredIdentity = Boolean(localStorage.getItem('registeredUser') && localStorage.getItem('userEmail'));
          const hasVisitedHome = localStorage.getItem('homeVisited') === 'true';
          setState(hasRegisteredIdentity ? 'login' : hasVisitedHome ? 'register' : 'home');
        }
      });

    return () => { cancelled = true; };
  }, [location.pathname]);

  if (state === 'checking') {
    return <div className="min-h-screen flex items-center justify-center bg-[var(--app-bg)] text-[var(--app-text)] text-sm">Checking account…</div>;
  }
  if (state === 'home') return <Navigate to="/home" replace state={{ from: location.pathname }} />;
  if (state === 'register') return <Navigate to="/register" replace state={{ from: location.pathname }} />;
  if (state === 'login') return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children || <Outlet />;
};

export default RegistrationGate;
