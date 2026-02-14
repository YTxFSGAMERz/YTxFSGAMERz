import React from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const Hero = () => {
    const sectionRef = useScrollAnimation();

    return (
        <section ref={sectionRef} id="home" className="hero-section fade-in">
            <div className="container hero-container">
                <div className="hero-content">
                    <h1 className="hero-title">
                        <span className="text-secondary" style={{ fontSize: '1.5rem', display: 'block', marginBottom: '1rem', fontWeight: 500 }}>
                            Hello, I'm Farhan
                        </span>
                        Computer Science Engineer<br />
                        <span className="text-gradient">Cybersecurity & AI Enthusiast</span>
                    </h1>
                    <p className="hero-description">
                        Analytical mindset, builder mentality, and a relentless passion for understanding technology at its core.
                        I strive to engineer secure, intelligent solutions for the future.
                    </p>
                    <div className="hero-actions">
                        <a href="#projects" className="btn-primary">View Projects</a>
                        <a href="#contact" className="btn-outline">Contact Me</a>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="portrait-placeholder">
                        <div className="portrait-glow"></div>
                        {/* Replace src with actual image later */}
                        <div className="portrait-circle">
                            <span style={{ fontSize: '3rem' }}>👨‍💻</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Decor */}
            <div className="glow-orb orb-1"></div>
            <div className="glow-orb orb-2"></div>
        </section>
    );
};

export default Hero;
