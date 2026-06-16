import React, { useRef, useState } from 'react';

const TiltCard = ({ children, className = '', style = {} }) => {
    const cardRef = useRef(null);
    const [transform, setTransform] = useState('none');
    const [isHovered, setIsHovered] = useState(false);

    // For calculating the dynamic rim light/glare position
    const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        const centerX = width / 2;
        const centerY = height / 2;

        // We use a 2D transform instead of 3D (rotateX/rotateY) 
        // because Chrome fundamentally breaks backdrop-filter (frosted glass) 
        // whenever a 3D perspective transform is applied.
        setTransform(`translateY(-5px) scale(1.02)`);

        // Update glare position (percentage)
        setGlarePos({
            x: (x / width) * 100,
            y: (y / height) * 100
        });
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setTransform('none');
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                transform,
                transition: 'transform 0.1s ease-out, box-shadow 0.3s ease',
                boxShadow: isHovered ? '0 10px 40px var(--hover-shadow)' : 'none',
                position: 'relative',
                borderRadius: style.borderRadius || '24px',
                height: style.height || 'auto',
                width: style.width || '100%',
                zIndex: isHovered ? 10 : 1 // Bring to front on hover
            }}
        >
            <div 
                className={`tilt-card ${className}`}
                style={{
                    ...style,
                    width: '100%',
                    height: '100%',
                    position: 'relative' // Ensure children layer correctly
                }}
            >
                {/* Dynamic CSS rim light/glare that follows the cursor */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        zIndex: 10,
                        pointerEvents: 'none',
                        background: isHovered
                            ? `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)`
                            : 'transparent',
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        mixBlendMode: 'overlay',
                        borderRadius: 'inherit'
                    }}
                />
                {/* Extremely subtle rim light border overlay */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        zIndex: 9,
                        pointerEvents: 'none',
                        borderRadius: 'inherit',
                        boxShadow: isHovered ? `inset 0 0 0 1px rgba(255,255,255,0.2)` : 'inset 0 0 0 1px rgba(255,255,255,0.05)',
                        transition: 'box-shadow 0.3s ease'
                    }}
                />

                {typeof children === 'function' ? children(isHovered) : children}
            </div>
        </div>
    );
};

export default TiltCard;
