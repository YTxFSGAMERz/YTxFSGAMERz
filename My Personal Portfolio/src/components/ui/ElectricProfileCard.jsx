import React from 'react';

const ElectricProfileCard = ({ children, className = '' }) => {
    return (
        <div className={`relative group rounded-3xl p-[2px] overflow-hidden ${className}`}>
            {/* Animated electric neon border glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 rounded-3xl opacity-75 blur-[3px] group-hover:opacity-100 transition duration-700 animate-pulse" />
            <div className="relative bg-[#0d071d]/90 backdrop-blur-xl rounded-[22px] overflow-hidden">
                {children}
            </div>
        </div>
    );
};

export default ElectricProfileCard;
