import React from 'react';
import TiltCard from './TiltCard';
import useScrollAnimation from '../hooks/useScrollAnimation';

const skills = [
    { name: "Cybersecurity", icon: "🛡️" },
    { name: "AI & ML", icon: "🤖" },
    { name: "Mathematics", icon: "📐" },
    { name: "Programming", icon: "💻" },
    { name: "Video Editing", icon: "🎬" },
    { name: "Emerging Tech", icon: "🚀" }
];

const Skills = () => {
    const sectionRef = useScrollAnimation();

    return (
        <section ref={sectionRef} id="skills" className="section-padding fade-up" style={{ background: 'rgba(255,255,255,0.01)' }}>
            <div className="container">
                <h2 className="section-title">Core Skills</h2>
                <div className="skills-grid">
                    {skills.map((skill, index) => (
                        <TiltCard key={index} className="skill-card glass-card">
                            <span className="skill-icon">{skill.icon}</span>
                            <h3 className="skill-name">{skill.name}</h3>
                        </TiltCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
