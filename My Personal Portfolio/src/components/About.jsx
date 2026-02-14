import React from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const About = () => {
    const sectionRef = useScrollAnimation();

    return (
        <section ref={sectionRef} id="about" className="section-padding fade-up">
            <div className="container">
                <h2 className="section-title">About Me</h2>
                <div className="about-grid">
                    <div className="about-text">
                        <p>
                            I am a disciplined, future-focused technologist grounded in timeless principles of integrity, respect, and continuous growth.
                            My journey is defined not just by the code I write, but by the problems I solve and the impact I create.
                        </p>
                        <p>
                            Merging deep analytical logic with a builder's creativity, I specialize in dissecting complex systems—whether in
                            <span className="text-gradient"> Cybersecurity</span> or <span className="text-gradient">Artificial Intelligence</span>.
                            I don't just use tools; I dissect them to understand the architecture that powers innovation.
                        </p>
                        <p>
                            I reject mediocrity. In a world of noise, I aim for mastery, leadership, and purposeful creation, building technology that shapes a smarter, more secure future.
                        </p>
                    </div>
                    <div className="about-visual glass-card">
                        {/* Abstract representation of 'Structure & Chaos' */}
                        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '6rem', opacity: 0.1, fontWeight: 'bold' }}>LOGIC</span>
                            <div style={{ position: 'absolute', width: '150px', height: '150px', border: '2px solid var(--primary-purple)', borderRadius: '50%' }}></div>
                            <div style={{ position: 'absolute', width: '200px', height: '200px', border: '1px dashed var(--accent-cyan)', borderRadius: '50%', animation: 'spin 10s linear infinite' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
