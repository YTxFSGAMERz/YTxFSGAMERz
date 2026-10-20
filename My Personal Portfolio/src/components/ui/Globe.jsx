import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Globe = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const width = containerRef.current.clientWidth || 320;
        const height = containerRef.current.clientHeight || 320;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = 240;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        // Holographic Wireframe Sphere
        const sphereGeo = new THREE.SphereGeometry(75, 24, 24);
        const wireframeMat = new THREE.MeshBasicMaterial({
            color: 0x00f3ff,
            wireframe: true,
            transparent: true,
            opacity: 0.25
        });
        const sphere = new THREE.Mesh(sphereGeo, wireframeMat);
        scene.add(sphere);

        // Core Glowing Points
        const pointsGeo = new THREE.BufferGeometry();
        const count = 300;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;
            positions[i * 3] = 78 * Math.cos(theta) * Math.sin(phi);
            positions[i * 3 + 1] = 78 * Math.sin(theta) * Math.sin(phi);
            positions[i * 3 + 2] = 78 * Math.cos(phi);
        }
        pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const pointsMat = new THREE.PointsMaterial({
            color: 0xa200ff,
            size: 3,
            transparent: true,
            opacity: 0.8
        });
        const points = new THREE.Points(pointsGeo, pointsMat);
        scene.add(points);

        // Neon Equator Ring
        const ringGeo = new THREE.RingGeometry(85, 87, 48);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0x00f3ff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 3;
        scene.add(ring);

        let animationFrameId;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            sphere.rotation.y += 0.004;
            sphere.rotation.x += 0.002;
            points.rotation.y += 0.005;
            points.rotation.x += 0.002;
            ring.rotation.z += 0.003;
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (!containerRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            renderer.dispose();
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ width: '100%', height: '100%', minHeight: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        />
    );
};

export default Globe;
