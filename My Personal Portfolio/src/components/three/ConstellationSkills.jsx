import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const skillsData = [
    { id: 'cyber', name: "Cybersecurity", pos: new THREE.Vector3(-3, 2, 0) },
    { id: 'ai', name: "AI & ML", pos: new THREE.Vector3(3, 3, -1) },
    { id: 'math', name: "Mathematics", pos: new THREE.Vector3(0, 4, 1) },
    { id: 'prog', name: "Programming", pos: new THREE.Vector3(-2, -2, 1) },
    { id: 'video', name: "Video Editing", pos: new THREE.Vector3(2, -1, 0) },
    { id: 'tech', name: "Emerging Tech", pos: new THREE.Vector3(0, -3, -2) }
];

// Define which nodes connect to form the constellation
const connections = [
    [0, 2], [2, 1], [1, 4], [4, 5], [5, 3], [3, 0], [2, 3], [0, 4]
];

const SkillNode = ({ position, name, isHovered, onHover, onUnhover }) => {
    const meshRef = useRef();

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.5;
            meshRef.current.scale.lerp(new THREE.Vector3(
                isHovered ? 1.5 : 1,
                isHovered ? 1.5 : 1,
                isHovered ? 1.5 : 1
            ), 0.1);
        }
    });

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onPointerOver={(e) => { e.stopPropagation(); onHover(); document.body.style.cursor = 'pointer'; }}
                onPointerOut={(e) => { e.stopPropagation(); onUnhover(); document.body.style.cursor = 'auto'; }}
            >
                <icosahedronGeometry args={[0.3, 1]} />
                <meshStandardMaterial
                    color={isHovered ? '#00f3ff' : '#7b2cbf'}
                />
            </mesh>
        </group>
    );
};

const ConstellationSkills = () => {
    const [hoveredNode, setHoveredNode] = useState(null);

    const lines = useMemo(() => {
        return connections.map((conn, idx) => {
            const start = skillsData[conn[0]].pos;
            const end = skillsData[conn[1]].pos;
            const isConnectedToHovered = hoveredNode === conn[0] || hoveredNode === conn[1];

            // Build simple buffer geometry native line
            const geom = new THREE.BufferGeometry().setFromPoints([start, end]);

            return (
                null
            );
        });
    }, [hoveredNode]);

    const groupRef = useRef();

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {lines}
            {skillsData.map((skill, i) => (
                <SkillNode
                    key={skill.id}
                    position={skill.pos}
                    name={skill.name}
                    isHovered={hoveredNode === i}
                    onHover={() => setHoveredNode(i)}
                    onUnhover={() => setHoveredNode(null)}
                />
            ))}
        </group>
    );
};

const ConstellationSkillsContainer = () => {
    return (
        <div style={{ width: '100%', height: '500px', position: 'relative' }}>
            <Canvas camera={{ position: [0, 0, 8], fov: 60 }} style={{ pointerEvents: 'auto' }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <ConstellationSkills />
            </Canvas>
        </div>
    );
};

export default ConstellationSkillsContainer;
