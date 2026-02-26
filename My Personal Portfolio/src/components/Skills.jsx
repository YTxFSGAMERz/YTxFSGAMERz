import React, { useState, useEffect } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const skills = [
    { id: 'sec', name: "Cybersecurity", icon: "🛡️", x: 20, y: 30, color: "#ff3366" },
    { id: 'ai', name: "AI & ML", icon: "🤖", x: 75, y: 25, color: "#00f3ff" },
    { id: 'math', name: "Mathematics", icon: "📐", x: 45, y: 15, color: "#a200ff" },
    { id: 'prog', name: "Programming", icon: "💻", x: 50, y: 80, color: "#10b981" },
    { id: 'vid', name: "Video Editing", icon: "🎬", x: 25, y: 70, color: "#f59e0b" },
    { id: 'tech', name: "Emerging Tech", icon: "🚀", x: 80, y: 65, color: "#8b5cf6" }
];

const connections = [
    ['sec', 'math'], ['math', 'ai'], ['math', 'prog'],
    ['sec', 'vid'], ['vid', 'prog'], ['prog', 'tech'], ['ai', 'tech']
];

const SkillsMap = () => {
    const [hoveredNode, setHoveredNode] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100
        });
    };

    return (
        <div
            className="skills-map-container"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredNode(null)}
            style={{
                position: 'relative',
                width: '100%',
                height: '500px',
                background: 'rgba(5, 5, 10, 0.6)',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)'
            }}
        >
            {/* Dynamic Background Spotlight */}
            <div style={{
                position: 'absolute',
                top: `${mousePos.y}%`,
                left: `${mousePos.x}%`,
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 70%)',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                transition: 'opacity 0.3s ease',
                opacity: hoveredNode ? 0.8 : 0.3
            }} />

            {/* Connection Lines (SVG) */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                {connections.map(([id1, id2], i) => {
                    const skill1 = skills.find(s => s.id === id1);
                    const skill2 = skills.find(s => s.id === id2);
                    const isHovered = hoveredNode === id1 || hoveredNode === id2;

                    return (
                        <line
                            key={i}
                            x1={`${skill1.x}%`}
                            y1={`${skill1.y}%`}
                            x2={`${skill2.x}%`}
                            y2={`${skill2.y}%`}
                            stroke={isHovered ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.05)'}
                            strokeWidth={isHovered ? 2 : 1}
                            style={{ transition: 'all 0.3s ease' }}
                        />
                    );
                })}
            </svg>

            {/* Skill Nodes */}
            {skills.map((skill) => {
                const isHovered = hoveredNode === skill.id;
                const isConnected = hoveredNode && connections.some(c => (c[0] === skill.id && c[1] === hoveredNode) || (c[1] === skill.id && c[0] === hoveredNode));
                const highlight = isHovered || isConnected;

                return (
                    <div
                        key={skill.id}
                        onMouseEnter={() => setHoveredNode(skill.id)}
                        style={{
                            position: 'absolute',
                            left: `${skill.x}%`,
                            top: `${skill.y}%`,
                            transform: `translate(-50%, -50%) scale(${isHovered ? 1.2 : 1})`,
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            zIndex: highlight ? 10 : 1,
                            opacity: hoveredNode && !highlight ? 0.3 : 1
                        }}
                    >
                        {/* Node Circle */}
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))`,
                            border: `1px solid ${isHovered ? skill.color : 'rgba(255,255,255,0.1)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                            boxShadow: isHovered ? `0 0 30px ${skill.color}88, inset 0 0 20px ${skill.color}44` : 'none',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease'
                        }}>
                            {skill.icon}
                        </div>

                        {/* Label */}
                        <div style={{
                            marginTop: '12px',
                            padding: '4px 12px',
                            background: isHovered ? skill.color : 'transparent',
                            color: isHovered ? '#fff' : 'rgba(255,255,255,0.6)',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: isHovered ? '600' : '400',
                            letterSpacing: '0.5px',
                            whiteSpace: 'nowrap',
                            boxShadow: isHovered ? `0 4px 15px ${skill.color}66` : 'none',
                            border: isHovered ? 'none' : '1px solid transparent',
                            transition: 'all 0.3s ease'
                        }}>
                            {skill.name}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const Skills = () => {
    const sectionRef = useScrollAnimation();

    return (
        <section ref={sectionRef} id="skills" className="section-padding fade-up" style={{ background: 'rgba(0,0,0,0)' }}>
            <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 className="section-title" style={{ display: 'inline-block', marginBottom: '1rem' }}>Core Capabilities</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '600px', margin: '0 auto' }}>
                        An interconnected network of my primary technical disciplines and creative skills.
                    </p>
                </div>
                <SkillsMap />
            </div>
        </section>
    );
};

export default Skills;
