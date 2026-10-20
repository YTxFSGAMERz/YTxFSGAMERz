import React from 'react';

const AppleEmoji = ({ char, width = 20, className = '' }) => {
    return (
        <span
            className={`inline-flex items-center justify-center align-middle select-none ${className}`}
            style={{ fontSize: `${width}px`, lineHeight: 1 }}
            role="img"
            aria-label="emoji"
        >
            {char}
        </span>
    );
};

export default AppleEmoji;
