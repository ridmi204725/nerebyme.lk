import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useOutletContext } from 'react-router-dom';

const AccountSettings = () => {
  const { user } = useAuth();
  const context = useOutletContext() || {};
  const isDark = context.isDark !== undefined ? context.isDark : true;

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    birthday: '',
    password: ''
  });
  
  const [sellerData, setSellerData] = useState({
    businessName: '',
    businessContact: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sellerStatus, setSellerStatus] = useState('none');

  useEffect(() => {
    // Fetch latest user details
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.user) {
          setFormData({
            fullName: data.user.fullName || '',
            phone: data.user.phone || '',
            birthday: data.user.birthday ? data.user.birthday.substring(0, 10) : '',
            password: ''
          });
          setSellerStatus(data.user.sellerStatus || 'none');
          if (data.user.businessName) setSellerData(prev => ({...prev, businessName: data.user.businessName}));
          if (data.user.businessContact) setSellerData(prev => ({...prev, businessContact: data.user.businessContact}));
        }
      } catch (err) {
        console.error('Error fetching user', err);
      }
    };
    fetchUser();
  }, [API_BASE_URL]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSellerChange = (e) => {
    setSellerData({ ...sellerData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Profile updated successfully!');
        setFormData(prev => ({ ...prev, password: '' }));
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (err) {
      setMessage('Failed to update profile');
    }
    setLoading(false);
  };

  const handleRequestSeller = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/auth/request-seller`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sellerData)
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Seller request submitted successfully!');
        setSellerStatus('pending');
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (err) {
      setMessage('Failed to submit request');
    }
    setLoading(false);
  };

  return (
    <div className={`container mx-auto px-4 py-8 max-w-4xl pt-24 ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>
      <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-800'}`}>Account Settings</h1>
      
      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${message.includes('Error') ? (isDark ? 'bg-red-900/30 text-red-400 border-red-800/50' : 'bg-red-50 text-red-800 border-red-200') : (isDark ? 'bg-blue-900/30 text-blue-400 border-blue-800/50' : 'bg-blue-50 text-blue-800 border-blue-200')}`}>
          {message}
        </div>
      )}

      <div className={`rounded-xl shadow-md p-6 mb-8 border ${isDark ? 'bg-[#11131a] border-gray-800' : 'bg-white border-slate-100'}`}>
        <h2 className={`text-2xl font-semibold mb-6 ${isDark ? 'text-gray-100' : 'text-slate-700'}`}>Profile Details</h2>
        <form onSubmit={handleUpdateProfile}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className={`block mb-2 font-medium ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${isDark ? 'bg-[#161922] border-gray-800 text-white' : 'bg-white border-gray-200'}`} />
            </div>
            <div>
              <label className={`block mb-2 font-medium ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${isDark ? 'bg-[#161922] border-gray-800 text-white' : 'bg-white border-gray-200'}`} />
            </div>
            <div>
              <label className={`block mb-2 font-medium ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Birthday</label>
              <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${isDark ? 'bg-[#161922] border-gray-800 text-white' : 'bg-white border-gray-200'}`} />
            </div>
            <div>
              <label className={`block mb-2 font-medium ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>New Password (leave blank to keep current)</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${isDark ? 'bg-[#161922] border-gray-800 text-white' : 'bg-white border-gray-200'}`} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer disabled:opacity-50">
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      {(user?.role === 'user' && sellerStatus !== 'approved') && (
        <div className={`rounded-xl shadow-md p-6 border ${isDark ? 'bg-[#11131a] border-gray-800' : 'bg-white border-slate-100'}`}>
          <h2 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-gray-100' : 'text-slate-700'}`}>Become a Seller</h2>
          
          {sellerStatus === 'pending' ? (
            <div className={`p-4 rounded-lg font-medium border ${isDark ? 'bg-amber-900/30 text-amber-400 border-amber-800/50' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
              Your request to become a seller is currently pending admin approval.
            </div>
          ) : sellerStatus === 'rejected' ? (
            <div className={`p-4 rounded-lg font-medium mb-6 border ${isDark ? 'bg-red-900/30 text-red-400 border-red-800/50' : 'bg-red-50 text-red-800 border-red-200'}`}>
              Your previous request was rejected. You can submit a new request below.
            </div>
          ) : (
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Want to list your properties and services? Apply to become a seller!</p>
          )}

          {sellerStatus !== 'pending' && (
            <form onSubmit={handleRequestSeller}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={`block mb-2 font-medium ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Business Name (Optional)</label>
                  <input type="text" name="businessName" value={sellerData.businessName} onChange={handleSellerChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${isDark ? 'bg-[#161922] border-gray-800 text-white' : 'bg-white border-gray-200'}`} />
                </div>
                <div>
                  <label className={`block mb-2 font-medium ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Business Contact (Optional)</label>
                  <input type="text" name="businessContact" value={sellerData.businessContact} onChange={handleSellerChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${isDark ? 'bg-[#161922] border-gray-800 text-white' : 'bg-white border-gray-200'}`} />
                </div>
              </div>
              <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition cursor-pointer disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
