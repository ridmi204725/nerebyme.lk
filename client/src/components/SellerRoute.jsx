import React from 'react';
import { Navigate } from 'react-router-dom';

const SellerRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Only users with role 'seller' or 'admin' can access the Seller Portal
  if (role !== 'seller' && role !== 'admin') {
    alert("Access Denied: The Seller Portal is restricted to registered Sellers. You can apply to become a seller from your Account Settings.");
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default SellerRoute;
