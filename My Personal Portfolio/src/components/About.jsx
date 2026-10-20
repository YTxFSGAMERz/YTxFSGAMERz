import React from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { ChevronRight, Github, Linkedin, Mail, Code, Cpu, Globe, Zap } from 'lucide-react';
import AppleEmoji from './AppleEmoji';
import ElectricProfileCard from './ui/ElectricProfileCard';

const About = () => {
    const sectionRef = useScrollAnimation();

    const stats = [
        { label: 'Public Repos', value: '64+', icon: <Code size={18} color="#aaff00" /> },
        { label: 'Live Systems', value: '8+', icon: <Globe size={18} color="#00f3ff" /> },
        { label: 'Crates.io', value: '1', icon: <Cpu size={18} color="#ff9f1c" /> },
        { label: 'Hackathons', value: '2x', icon: <Zap size={18} color="#2ec4b6" /> }
    ];

    const skills = ["Python", "Rust", "Kali Linux (VAPT)", "Google Gemma 4", "PyTorch", "eBPF", "FastAPI", "React 19", "Three.js", "Docker"];
    const interests = ["Offline AI Copilots", "Autonomous Agents", "Kernel Customization", "Quantitative Econometrics", "Content-Addressable Storage"];

    return (
        <section ref={sectionRef} id="about" className="section-padding about-section">
            <div className="container">
                <div className="about-container">
                    {/* Left Column: Content */}
                    <div className="about-content">
                        <div className="section-header">
                            <h2 className="about-title">About <span className="text-gradient">Me</span></h2>
                        </div>

                        <p className="about-description">
                            I’m Farhan, a Computer Science Engineering student and offensive security researcher passionate about <span className="text-highlight">Cybersecurity (VAPT)</span>, <span className="text-highlight">Autonomous AI Agents</span>, and <span className="text-highlight">Systems Engineering</span>. I learn by building, breaking, and turning complex systems into production-ready software.
                        </p>
                        <p className="about-description">
                            From engineering offline-first AI copilots with 100% data sovereignty (<span className="text-highlight">PenMunshi</span>) and publishing high-performance Rust CAS engines (<span className="text-highlight">bdstorage</span> on Crates.io), to autonomous opportunity scouts tracking $2.4M+, I bridge deep-tech systems with interactive frontend intelligence. <AppleEmoji char="⚡" width={24} className="inline ml-1" />
                        </p>

                        <div className="about-tags-section">
                            <h3 className="tag-heading"><ChevronRight size={16} className="tag-icon" /> Core Arsenal</h3>
                            <div className="tags-grid">
                                {skills.map((skill, index) => (
                                    <span key={index} className="skill-tag">{skill}</span>
                                ))}
                            </div>
                        </div>

                        <div className="about-tags-section">
                            <h3 className="tag-heading"><ChevronRight size={16} className="tag-icon purple" /> Focus Areas</h3>
                            <div className="tags-grid">
                                {interests.map((interest, index) => (
                                    <span key={index} className="interest-tag">{interest}</span>
                                ))}
                            </div>
                        </div>

                        <div className="social-row">
                            <a href="https://github.com/YTxFSGAMERz" target="_blank" rel="noopener noreferrer" className="social-btn" title="GitHub (@YTxFSGAMERz)"><Github size={20} /></a>
                            <a href="https://linkedin.com/in/farhan-shaikh-fs" target="_blank" rel="noopener noreferrer" className="social-btn" title="LinkedIn"><Linkedin size={20} /></a>
                            <a href="https://discord.com/users/1354206425068343419" target="_blank" rel="noopener noreferrer" className="social-btn" title="Discord (@1.n.only.fs)"><Zap size={20} /></a>
                            <a href="mailto:f98561965@gmail.com" className="social-btn" title="Email"><Mail size={20} /></a>
                        </div>
                    </div>

                    {/* Right Column: Visuals */}
                    <div className="about-visuals">
                        <ElectricProfileCard className="profile-card">
                            <div className="profile-image-container">
                                {/* Placeholder Gradient Art */}
                                <div className="profile-placeholder-art"></div>
                                <div className="profile-overlay">
                                    <div className="profile-info">
                                        <h3 className="profile-name">Farhan Shaikh</h3>
                                        <p className="profile-title">Computer Science Engineer</p>
                                    </div>
                                </div>
                            </div>
                        </ElectricProfileCard>

                        <div className="stats-row">
                            {stats.map((stat, index) => (
                                <div key={index} className="stat-card glass-card">
                                    <div className="stat-header">
                                        {stat.icon}
                                    </div>
                                    <span className="stat-value">{stat.value}</span>
                                    <span className="stat-label">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
