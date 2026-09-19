import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaUserPlus, FaCheckCircle } from 'react-icons/fa';

const GoogleAccountModal = ({ isOpen, onClose, onSelect, savedAccounts, onAddAccount }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-[1.5rem] shadow-2xl overflow-hidden font-poppins"
                    >
                        <div className="p-8">
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-12 h-12 bg-white shadow-md rounded-full flex items-center justify-center mb-4 border border-gray-100">
                                    <FaGoogle className="text-[24px] text-[#4285F4]" />
                                </div>
                                <h2 className="text-[22px] font-bold text-[#202124]">Choose an account</h2>
                                <p className="text-[14px] text-[#5f6368] mt-1">to continue to Holiday.lk</p>
                            </div>

                            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                                {savedAccounts.map((account) => (
                                    <button
                                        key={account.email}
                                        onClick={() => onSelect(account)}
                                        className="w-full group relative flex items-center gap-4 p-4 border border-[#e0e0e0] rounded-xl hover:bg-[#f5f5f5] hover:shadow-sm transition-all duration-200 text-left active:ring-2 active:ring-[#4285F4] active:border-transparent"
                                    >
                                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                                            {account.profilePic ? (
                                                <img src={account.profilePic} alt={account.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-xl uppercase">
                                                    {account.name[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="text-[16px] font-bold text-[#202124]">{account.email}</div>
                                            <div className="text-[14px] text-[#5f6368]">{account.name}</div>
                                        </div>
                                        {account.isSelected && (
                                            <FaCheckCircle className="text-[#4285F4] text-xl" />
                                        )}
                                    </button>
                                ))}

                                <button
                                    onClick={onAddAccount}
                                    className="w-full flex items-center gap-4 p-4 border border-[#e0e0e0] rounded-xl hover:bg-[#f5f5f5] transition-all text-left text-[#1f2937]"
                                >
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100 text-gray-600">
                                        <FaUserPlus className="text-xl" />
                                    </div>
                                    <span className="text-[16px] font-medium">Use another account</span>
                                </button>
                            </div>
                        </div>

                        <div className="px-8 pb-6 text-center">
                            <p className="text-[12px] text-[#5f6368] leading-relaxed">
                                To continue, Google will share your name, email address, language preference, and profile picture with Holiday.lk.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default GoogleAccountModal;
