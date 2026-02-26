import React from 'react';
import TiltCard from './TiltCard';
import useScrollAnimation from '../hooks/useScrollAnimation';

const projects = [
    {
        title: "AI Universe Simulation",
        category: "Generative AI",
        image: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        color: "#00f3ff",
        status: "Beta"
    },
    {
        title: "Quantum Neural Dashboard",
        category: "Data Visualization",
        image: "linear-gradient(135deg, #0f0c29 0%, #302b63 100%)",
        color: "#a200ff",
        status: "Coming Soon"
    },
    {
        title: "Nebula Core Engine",
        category: "WebGL Architect",
        image: "linear-gradient(135deg, #020010 0%, #1a0b2e 100%)",
        color: "#ff3366",
        status: "Concept"
    }
];

const Projects = () => {
    const sectionRef = useScrollAnimation();

    return (
        <section ref={sectionRef} id="projects" className="section-padding fade-up">
            <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 className="section-title" style={{ display: 'inline-block', marginBottom: '1rem' }}>Featured Projects</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '600px', margin: '0 auto' }}>
                        A selection of my recent works exploring the intersection of modern design, complex engineering, and artificial intelligence.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '2.5rem',
                    perspective: '1000px'
                }}>
                    {projects.map((project, index) => (
                        <TiltCard
                            key={index}
                            style={{
                                height: '420px',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                border: '1px solid rgba(255,255,255,0.05)',
                                background: 'rgba(2,0,16,0.5)',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            {(isHovered) => (
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    background: project.image
                                }}>

                                    {/* Animated Background Overlay Pattern */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                        opacity: isHovered ? 0.6 : 0.2,
                                        transition: 'opacity 0.5s ease',
                                        pointerEvents: 'none'
                                    }} />

                                    {/* Glowing Top Border */}
                                    <div style={{
                                        position: 'absolute',
                                        top: 0, left: 0, width: '100%', height: '2px',
                                        background: `linear-gradient(90deg, transparent, ${project.color}, transparent)`,
                                        opacity: isHovered ? 1 : 0.1,
                                        transition: 'opacity 0.5s ease',
                                        boxShadow: isHovered ? `0 0 20px ${project.color}` : 'none',
                                        zIndex: 5
                                    }} />

                                    {/* Status Badge */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '1.5rem', right: '1.5rem',
                                        padding: '0.4rem 1rem',
                                        borderRadius: '50px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        letterSpacing: '0.05em',
                                        textTransform: 'uppercase',
                                        background: isHovered ? `${project.color}33` : 'rgba(255,255,255,0.05)',
                                        color: isHovered ? '#fff' : 'rgba(255,255,255,0.5)',
                                        border: `1px solid ${isHovered ? `${project.color}aa` : 'rgba(255,255,255,0.1)'}`,
                                        transition: 'all 0.3s ease',
                                        backdropFilter: 'blur(10px)',
                                        zIndex: 10,
                                        boxShadow: isHovered ? `0 0 15px ${project.color}66` : 'none'
                                    }}>
                                        {project.status}
                                    </div>

                                    {/* Bottom Content Area */}
                                    <div style={{
                                        marginTop: 'auto',
                                        padding: '5rem 2rem 2rem 2rem',
                                        position: 'relative',
                                        zIndex: 10,
                                        background: 'linear-gradient(to top, rgba(2,0,16,0.95) 0%, rgba(2,0,16,0.8) 50%, transparent 100%)',
                                        transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
                                        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                    }}>
                                        <div style={{
                                            color: project.color,
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            letterSpacing: '0.1em',
                                            textTransform: 'uppercase',
                                            marginBottom: '0.5rem',
                                            opacity: isHovered ? 1 : 0.8,
                                            transition: 'opacity 0.3s ease'
                                        }}>
                                            {project.category}
                                        </div>
                                        <h3 style={{
                                            fontSize: '1.75rem',
                                            fontWeight: '700',
                                            color: '#ffffff',
                                            marginBottom: '1.5rem',
                                            textShadow: isHovered ? `0 0 20px rgba(255,255,255,0.3)` : 'none',
                                            transition: 'all 0.3s ease',
                                            lineHeight: 1.2
                                        }}>
                                            {project.title}
                                        </h3>

                                        {/* Action Button/Arrow (appears on hover) */}
                                        <div style={{
                                            width: isHovered ? '100px' : '45px',
                                            height: '45px',
                                            borderRadius: '50px',
                                            background: isHovered ? project.color : 'rgba(255,255,255,0.05)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: `1px solid ${isHovered ? project.color : 'rgba(255,255,255,0.1)'}`,
                                            color: '#fff',
                                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                            boxShadow: isHovered ? `0 0 15px ${project.color}66` : 'none',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            position: 'relative'
                                        }}>
                                            <span style={{
                                                position: 'absolute',
                                                opacity: isHovered ? 1 : 0,
                                                transform: isHovered ? 'translateX(-10px)' : 'translateX(20px)',
                                                transition: 'all 0.4s ease',
                                                fontSize: '0.85rem',
                                                fontWeight: '600'
                                            }}>Explore</span>
                                            <span style={{
                                                position: 'absolute',
                                                transform: isHovered ? 'translateX(35px) rotate(-45deg)' : 'translateX(0) rotate(0deg)',
                                                transition: 'all 0.4s ease'
                                            }}>→</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </TiltCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
