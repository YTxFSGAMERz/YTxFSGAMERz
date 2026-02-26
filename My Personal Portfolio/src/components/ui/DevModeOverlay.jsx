import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const DevModeOverlay = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [stats, setStats] = useState({
        fps: 0,
        deviceTier: 'Unknown',
        particles: 0,
        calls: 0
    });

    useEffect(() => {
        // Toggle visibility w/ 'd' or 'D'
        const handleKeyDown = (e) => {
            if (e.key.toLowerCase() === 'd') {
                setIsVisible(v => !v);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        // Simple FPS tracking
        let frameCount = 0;
        let lastTime = performance.now();
        let animationFrameId;

        const updateFPS = () => {
            frameCount++;
            const now = performance.now();
            if (now - lastTime >= 1000) {
                setStats(prev => ({ ...prev, fps: frameCount }));
                frameCount = 0;
                lastTime = now;
            }
            animationFrameId = requestAnimationFrame(updateFPS);
        };
        animationFrameId = requestAnimationFrame(updateFPS);

        // Hardware info
        let tier = 'High';
        const isMobile = window.innerWidth < 768;
        if (typeof navigator !== 'undefined') {
            const memory = navigator.deviceMemory || 8;
            const cores = navigator.hardwareConcurrency || 4;
            if (memory < 8 || cores < 4 || isMobile) tier = 'Low/Mobile';
        }

        // Approximate Particle count based on logic from GalaxyHero
        const particlesCount = tier === 'Low/Mobile' ? 500 : 2000;

        setStats(prev => ({
            ...prev,
            deviceTier: tier,
            particles: particlesCount,
            calls: '1 (Instanced)' // Placeholder for WebGL info
        }));

        return () => cancelAnimationFrame(animationFrameId);
    }, [isVisible]);

    if (!isVisible) return null;

    return createPortal(
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            backgroundColor: 'rgba(0,0,0,0.85)',
            border: '1px solid #333',
            color: '#00f3ff',
            padding: '12px 16px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '13px',
            zIndex: 99999,
            pointerEvents: 'none',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}>
            <h4 style={{ margin: '0 0 8px 0', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1px', color: '#ff006e' }}>
                Dev Mode
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '150px' }}>
                    <span>FPS:</span> <span>{stats.fps}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '150px' }}>
                    <span>Tier:</span> <span>{stats.deviceTier}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '150px' }}>
                    <span>Stars:</span> <span>{stats.particles}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '150px' }}>
                    <span>Draws (Stars):</span> <span>{stats.calls}</span>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default DevModeOverlay;
