import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// A single interactive planet
const Planet = ({ color, name, onClick, isSelected, orbitRadius, orbitSpeed, initialAngle, size, hasRing }) => {
    const groupRef = useRef();
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Revolve around the center
            groupRef.current.rotation.y += delta * orbitSpeed;
        }
        if (meshRef.current) {
            // Spin on own axis
            meshRef.current.rotation.y += delta * 0.4;
            meshRef.current.rotation.z += delta * 0.1;

            // Hover scale effect
            const targetScale = hovered ? 1.15 : 1;
            meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        }
    });

    // Generate a simple trail path
    const trailGeom = useMemo(() => {
        const points = [];
        for (let i = 0; i <= 32; i++) {
            const t = (i / 32) * Math.PI * 0.4; // Trail length
            points.push(new THREE.Vector3(
                Math.cos(t) * orbitRadius,
                0,
                -Math.sin(t) * orbitRadius
            ));
        }
        return new THREE.BufferGeometry().setFromPoints(points);
    }, [orbitRadius]);

    return (
        <group ref={groupRef} rotation={[0, initialAngle, 0]}>
            {/* The full orbit ring line */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[orbitRadius - 0.02, orbitRadius + 0.02, 64]} />
                <meshBasicMaterial color={color} transparent opacity={0.05} side={THREE.DoubleSide} />
            </mesh>

            {/* Glowing Trail behind the planet */}
            <line geometry={trailGeom}>
                <lineBasicMaterial color={color} transparent opacity={0.3} />
            </line>

            <group position={[orbitRadius, 0, 0]}>
                <Float speed={hovered ? 0 : 2} rotationIntensity={0.5} floatIntensity={1}>
                    <group
                        onClick={(e) => {
                            e.stopPropagation();
                            // Calculate absolute world position for the camera to zoom to
                            const worldPosition = new THREE.Vector3();
                            e.object.getWorldPosition(worldPosition);
                            onClick(name, worldPosition);
                        }}
                        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
                        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
                    >
                        <mesh ref={meshRef}>
                            <sphereGeometry args={[size, 64, 64]} />
                            <meshStandardMaterial
                                color={color}
                                roughness={0.6}
                                metalness={0.2}
                                emissive={hovered ? color : '#000000'}
                                emissiveIntensity={0.3}
                                wireframe={hovered}
                            />
                        </mesh>

                        {/* Atmospheric rim glow */}
                        <mesh scale={1.2}>
                            <sphereGeometry args={[size, 32, 32]} />
                            <meshBasicMaterial
                                color={color}
                                transparent
                                opacity={hovered ? 0.4 : 0.15}
                                blending={THREE.AdditiveBlending}
                                side={THREE.BackSide}
                            />
                        </mesh>
                        <mesh scale={1.05}>
                            <sphereGeometry args={[size, 32, 32]} />
                            <meshBasicMaterial
                                color={color}
                                transparent
                                opacity={hovered ? 0.3 : 0.1}
                                blending={THREE.AdditiveBlending}
                            />
                        </mesh>

                        {/* Planetary Ring */}
                        {hasRing && (
                            <mesh rotation={[-Math.PI / 2.5, 0, 0]}>
                                <ringGeometry args={[size * 1.5, size * 2.2, 64]} />
                                <meshStandardMaterial
                                    color={color}
                                    transparent
                                    opacity={0.6}
                                    side={THREE.DoubleSide}
                                    roughness={0.8}
                                />
                            </mesh>
                        )}
                    </group>
                </Float>
            </group>
        </group>
    );
};

// Central Sun / Core
const CentralCore = () => {
    const coreRef = useRef();

    useFrame((state, delta) => {
        if (coreRef.current) {
            coreRef.current.rotation.y += delta * 0.1;
            const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.05 + 1;
            coreRef.current.scale.set(pulse, pulse, pulse);
        }
    });

    return (
        <mesh ref={coreRef}>
            <sphereGeometry args={[1.5, 32, 32]} />
            <meshBasicMaterial color="#ffffff" />
            <mesh scale={1.4}>
                <sphereGeometry args={[1.5, 32, 32]} />
                <meshBasicMaterial color="#00f3ff" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh scale={2}>
                <sphereGeometry args={[1.5, 32, 32]} />
                <meshBasicMaterial color="#7b2cbf" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
            </mesh>
        </mesh>
    );
};

// Ambient distant haze layer
const AmbientHaze = () => {
    const hazeCount = 3000;
    const { positions, colors } = useMemo(() => {
        const p = new Float32Array(hazeCount * 3);
        const c = new Float32Array(hazeCount * 3);
        const color = new THREE.Color();
        for (let i = 0; i < hazeCount; i++) {
            // Distant sphere/volume
            const r = 40 + Math.random() * 60;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            p[i * 3 + 2] = r * Math.cos(phi) - 20;

            color.setHSL(Math.random() * 0.2 + 0.5, 0.8, Math.random() * 0.5 + 0.1);
            c[i * 3] = color.r;
            c[i * 3 + 1] = color.g;
            c[i * 3 + 2] = color.b;
        }
        return { positions: p, colors: c };
    }, []);

    const hazeRef = useRef();
    useFrame((state, delta) => {
        if (hazeRef.current) {
            hazeRef.current.rotation.y += delta * 0.01;
            hazeRef.current.rotation.x += delta * 0.005;
        }
    });

    return (
        <points ref={hazeRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={hazeCount} array={positions} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={hazeCount} array={colors} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.1} vertexColors transparent opacity={0.4} blending={THREE.AdditiveBlending} sizeAttenuation />
        </points>
    );
};

// Rare Shooting Star
const ShootingStar = () => {
    const meshRef = useRef();
    const trailRef = useRef();
    const active = useRef(false);
    const timer = useRef(0);
    const speed = useRef(40);

    useFrame((state, delta) => {
        timer.current += delta;

        // Fire roughly every 15-25 seconds randomly
        if (!active.current && timer.current > 15 + Math.random() * 10) {
            active.current = true;
            timer.current = 0;
            const startX = (Math.random() - 0.5) * 80;
            const startY = 20 + Math.random() * 20;
            const startZ = -40 - Math.random() * 40;
            if (meshRef.current) {
                meshRef.current.position.set(startX, startY, startZ);
                // Aim downward/diagonal
                meshRef.current.lookAt(startX - 40, startY - 40, startZ + 20);
            }
        }

        if (active.current && meshRef.current) {
            meshRef.current.translateZ(delta * speed.current);
            // reset when out of bounds
            if (meshRef.current.position.y < -30) {
                active.current = false;
                meshRef.current.position.set(999, 999, 999);
            }
        }
    });

    return (
        <group ref={meshRef} position={[999, 999, 999]}>
            <mesh>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* Trail */}
            <mesh position={[0, 0, -2]}>
                <cylinderGeometry args={[0.01, 0.08, 4, 8]} />
                <meshBasicMaterial color="#00f3ff" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
            </mesh>
        </group>
    );
};

// Interactive Stars that move forward based on mouse position
const InteractiveStars = () => {
    const meshRef = useRef();
    const { camera, pointer } = useThree();

    // Responsive Star Count based on hardware detection
    const STAR_COUNT = useMemo(() => {
        let count = 2000;
        if (typeof navigator !== 'undefined') {
            if (navigator.deviceMemory && navigator.deviceMemory < 8) count = 800;
            if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) count = 500;
        }
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            count = Math.min(count, 500);
        }
        return count;
    }, []);

    // Physics state
    const { positions, basePositions, velocities } = useMemo(() => {
        const p = new Float32Array(STAR_COUNT * 3);
        const bp = new Float32Array(STAR_COUNT * 3);
        const v = new Float32Array(STAR_COUNT * 3);

        for (let i = 0; i < STAR_COUNT; i++) {
            const x = (Math.random() - 0.5) * 60;
            const y = (Math.random() - 0.5) * 40;
            const z = -Math.random() * 60 + 10;

            p[i * 3] = bp[i * 3] = x;
            p[i * 3 + 1] = bp[i * 3 + 1] = y;
            p[i * 3 + 2] = bp[i * 3 + 2] = z;

            v[i * 3] = v[i * 3 + 1] = v[i * 3 + 2] = 0;
        }
        return { positions: p, basePositions: bp, velocities: v };
    }, [STAR_COUNT]);

    // Reusables
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const ray = useMemo(() => new THREE.Ray(), []);
    const tmpV = useMemo(() => new THREE.Vector3(), []);
    const rayOrigin = useMemo(() => new THREE.Vector3(), []);
    const rayDir = useMemo(() => new THREE.Vector3(), []);

    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mediaQuery.matches);
        const handler = (e) => setReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    useEffect(() => {
        if (!meshRef.current) return;
        for (let i = 0; i < STAR_COUNT; i++) {
            dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [STAR_COUNT, positions, dummy]);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        const dt = Math.min(delta, 0.033);
        const threshold = 4.0;
        const strength = 30.0;
        const damping = 0.88;
        const spring = 0.2;

        if (!reducedMotion) {
            // Mouse ray
            const ndc = new THREE.Vector3(pointer.x, pointer.y, 0.5);
            ndc.unproject(camera);
            rayOrigin.copy(camera.position);
            rayDir.copy(ndc).sub(camera.position).normalize();
            ray.set(rayOrigin, rayDir);

            gsap.to(meshRef.current.rotation, {
                x: pointer.y * 0.1,
                y: pointer.x * 0.1,
                duration: 2,
                ease: 'power2.out'
            });
        }

        let needsUpdate = false;

        for (let i = 0; i < STAR_COUNT; i++) {
            const idx = i * 3;
            tmpV.set(positions[idx], positions[idx + 1], positions[idx + 2]);

            if (!reducedMotion) {
                const closest = new THREE.Vector3();
                ray.closestPointToPoint(tmpV, closest);
                const dist = tmpV.distanceTo(closest);

                if (dist < threshold) {
                    // Pull toward camera smoothly (quadratic falloff)
                    const normalized = dist / threshold;
                    const fall = Math.pow(1 - normalized, 2); // Smoother force curve
                    velocities[idx] += -rayDir.x * strength * fall * dt;
                    velocities[idx + 1] += -rayDir.y * strength * fall * dt;
                    velocities[idx + 2] += -rayDir.z * strength * fall * dt;
                } else {
                    velocities[idx] += (basePositions[idx] - positions[idx]) * spring * dt;
                    velocities[idx + 1] += (basePositions[idx + 1] - positions[idx + 1]) * spring * dt;
                    velocities[idx + 2] += (basePositions[idx + 2] - positions[idx + 2]) * spring * dt;
                }
            } else {
                velocities[idx] += (basePositions[idx] - positions[idx]) * spring * dt;
                velocities[idx + 1] += (basePositions[idx + 1] - positions[idx + 1]) * spring * dt;
                velocities[idx + 2] += (basePositions[idx + 2] - positions[idx + 2]) * spring * dt;
            }

            positions[idx] += velocities[idx] * dt;
            positions[idx + 1] += velocities[idx + 1] * dt;
            positions[idx + 2] += velocities[idx + 2] * dt;

            velocities[idx] *= damping;
            velocities[idx + 1] *= damping;
            velocities[idx + 2] *= damping;

            const speedSq = velocities[idx] ** 2 + velocities[idx + 1] ** 2 + velocities[idx + 2] ** 2;
            const distSq = (positions[idx] - basePositions[idx]) ** 2 + (positions[idx + 1] - basePositions[idx + 1]) ** 2 + (positions[idx + 2] - basePositions[idx + 2]) ** 2;

            if (speedSq > 0.0001 || distSq > 0.0001) {
                dummy.position.set(positions[idx], positions[idx + 1], positions[idx + 2]);
                dummy.updateMatrix();
                meshRef.current.setMatrixAt(i, dummy.matrix);
                needsUpdate = true;
            }
        }

        if (needsUpdate) {
            meshRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <instancedMesh ref={meshRef} args={[null, null, STAR_COUNT]}>
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshBasicMaterial color={0xffffff} transparent opacity={0.6} />
        </instancedMesh>
    );
};

// The main Galaxy Scene
const GalaxyScene = ({ activeSection, onNavigate }) => {
    const { camera } = useThree();

    // Define the planets (sections) with orbit parameters
    const planets = useMemo(() => [
        { id: 'about', color: '#7b2cbf', orbitRadius: 4, orbitSpeed: 0.15, angle: 0, size: 0.6, ring: true },
        { id: 'skills', color: '#00f3ff', orbitRadius: 6, orbitSpeed: 0.1, angle: Math.PI / 2, size: 0.5, ring: false },
        { id: 'projects', color: '#ff9f1c', orbitRadius: 8.5, orbitSpeed: 0.07, angle: Math.PI, size: 0.8, ring: true },
        { id: 'experience', color: '#38b000', orbitRadius: 11, orbitSpeed: 0.05, angle: Math.PI * 1.5, size: 0.7, ring: false },
        { id: 'contact', color: '#ff006e', orbitRadius: 14, orbitSpeed: 0.03, angle: Math.PI / 4, size: 0.4, ring: true }
    ], []);

    const handlePlanetClick = (id, position) => {
        // Find a camera position slightly in front of the planet and above it
        const newCamPos = new THREE.Vector3()
            .copy(position)
            .normalize()
            .multiplyScalar(position.length() + 4)
            .add(new THREE.Vector3(0, 2, 0));

        // GSAP animate camera
        gsap.to(camera.position, {
            x: newCamPos.x,
            y: newCamPos.y,
            z: newCamPos.z,
            duration: 1.5,
            ease: 'power3.inOut'
        });

        // Trigger external navigation (scroll or state)
        onNavigate(id);
    };

    // Scroll-based parallax drift
    const scrollY = useRef(0);
    useEffect(() => {
        const handleScroll = () => { scrollY.current = window.scrollY; };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const cameraGroupRef = useRef();
    useFrame((state, delta) => {
        if (!cameraGroupRef.current) return;
        // The max scroll depth determines how far we translate
        const scrollFactor = scrollY.current * 0.002;
        // Gently drift downward/forward based on scroll
        cameraGroupRef.current.position.y = THREE.MathUtils.lerp(cameraGroupRef.current.position.y, scrollFactor, 0.05);
        cameraGroupRef.current.position.z = THREE.MathUtils.lerp(cameraGroupRef.current.position.z, -scrollFactor * 2, 0.05);
    });

    return (
        <group ref={cameraGroupRef}>
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 0, 0]} intensity={2.5} color="#ffffff" distance={30} decay={2} />

            {/* Fog for atmospheric depth */}
            <fog attach="fog" args={['#050515', 10, 80]} />

            <CentralCore />

            {/* Ambient Background Haze */}
            <AmbientHaze />

            {/* Shooting Stars */}
            <ShootingStar />

            {/* Interactive moving starfield */}
            <InteractiveStars />

            {planets.map((planet) => (
                <Planet
                    key={planet.id}
                    name={planet.id}
                    color={planet.color}
                    size={planet.size}
                    hasRing={planet.ring}
                    orbitRadius={planet.orbitRadius}
                    orbitSpeed={planet.orbitSpeed}
                    initialAngle={planet.angle}
                    onClick={handlePlanetClick}
                    isSelected={activeSection === planet.id}
                />
            ))}

            {/* Orbit Controls restricted */}
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.5}
            />
        </group>
    );
};

// Container Component
const GalaxyHero = ({ activeSection, onNavigate }) => {
    return (
        <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}>
            {/* Set pointerEvents: auto on Canvas to capture orbital drags and clicks when not layered behind text */}
            <Canvas camera={{ position: [0, 8, 20], fov: 45 }} style={{ pointerEvents: 'auto' }} dpr={[1, 1.5]}>
                <GalaxyScene activeSection={activeSection} onNavigate={onNavigate} />
            </Canvas>
        </div>
    );
};

export default GalaxyHero;
