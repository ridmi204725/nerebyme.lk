import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPhoneAlt, FaMapMarkerAlt, FaRoute, FaInfoCircle, FaStar, FaGlobe } from 'react-icons/fa';

const LocationDetailsModal = ({ item, isOpen, onClose, language = 'English' }) => {
  if (!isOpen || !item) return null;

  const mapSearchUrl = item.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.name} ${item.location} ${item.district || ''}`)}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#11131a] border border-gray-800 text-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
        >
          {/* Header Image / Cover */}
          <div className="relative h-48 sm:h-56 w-full">
            <img
              src={item.image || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=700'}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#11131a] via-black/40 to-transparent" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-white p-2.5 rounded-full border border-white/10 transition-all cursor-pointer"
            >
              <FaTimes size={16} />
            </button>

            <div className="absolute bottom-4 left-6 right-6">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">
                {item.category || 'Location Details'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 text-white">{item.name}</h2>
              <p className="text-xs text-gray-300 flex items-center gap-1.5 mt-1">
                <FaMapMarkerAlt className="text-red-500" />
                <span>{item.location}, {item.district}</span>
              </p>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
            
            {/* Action Buttons Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {item.contact ? (
                <a
                  href={`tel:${item.contact}`}
                  className="flex items-center justify-center gap-2 p-3.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-2xl font-bold text-sm transition-all"
                >
                  <FaPhoneAlt />
                  <span>Call: {item.contact}</span>
                </a>
              ) : (
                <div className="flex items-center justify-center gap-2 p-3.5 bg-gray-800 text-gray-400 rounded-2xl text-sm font-semibold">
                  <FaPhoneAlt />
                  <span>Contact N/A</span>
                </div>
              )}

              <a
                href={mapSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 rounded-2xl font-bold text-sm transition-all"
              >
                <FaRoute size={16} />
                <span>Open Navigation Map</span>
              </a>
            </div>

            {/* About Us Section */}
            <div className="bg-[#161922] p-5 rounded-2xl border border-gray-800">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2 mb-2">
                <FaInfoCircle />
                <span>About Us & Overview</span>
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {item.aboutUs || item.description || `Welcome to ${item.name}! Located in ${item.location}, ${item.district}. We provide top tier services, memorable experiences, and warm hospitality.`}
              </p>
            </div>

            {/* Facilities / Amenities */}
            {((Array.isArray(item.facilities) && item.facilities.length > 0) || item.amenities) && (
              <div className="bg-[#161922] p-5 rounded-2xl border border-gray-800">
                <h3 className="text-base font-bold text-gray-200 mb-3">Key Facilities & Features</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(item.facilities) && item.facilities.map((fac, idx) => (
                    <span key={idx} className="bg-gray-800/80 text-gray-300 border border-gray-700 text-xs px-3 py-1.5 rounded-xl font-medium">
                      {fac}
                    </span>
                  ))}
                  {item.amenities?.hasAC && <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-3 py-1.5 rounded-xl">Air Conditioned</span>}
                  {item.amenities?.hasWifi && <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs px-3 py-1.5 rounded-xl">Free Wi-Fi</span>}
                  {item.amenities?.hasParking && <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-3 py-1.5 rounded-xl">Parking Available</span>}
                </div>
              </div>
            )}

            {/* Menu Items (if available) */}
            {Array.isArray(item.menu) && item.menu.length > 0 && (
              <div className="bg-[#161922] p-5 rounded-2xl border border-gray-800">
                <h3 className="text-base font-bold text-gray-200 mb-3">Featured Menu / Offerings</h3>
                <div className="space-y-2">
                  {item.menu.map((m, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-[#11131a] p-3 rounded-xl border border-gray-800">
                      <div>
                        <p className="font-semibold text-sm text-gray-200">{m.name}</p>
                        {m.description && <p className="text-xs text-gray-400">{m.description}</p>}
                      </div>
                      <span className="text-xs font-bold text-amber-400">{m.price ? `LKR ${m.price}` : 'Available'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-gray-800 bg-[#11131a] flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Close
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LocationDetailsModal;
