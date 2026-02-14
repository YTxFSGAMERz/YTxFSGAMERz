import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <p>&copy; {new Date().getFullYear()} Farhan. All rights reserved.</p>
                <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>
                    Built with React & Future-Focused Design.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
