import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface RotatingCubesLandingProps {
  accentColor?: string;
}

export const RotatingCubesLanding: React.FC<RotatingCubesLandingProps> = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x03150f, 0.025);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 8, 26);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting (Emerald Fintech & Growth palette)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x10b981, 2.5); // Emerald
    dirLight1.position.set(15, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 2.0); // Cyan
    dirLight2.position.set(-15, -10, -15);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x34d399, 3, 40);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // 1. Central Core Cube Matrix
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const coreGeo = new THREE.BoxGeometry(3.5, 3.5, 3.5);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x059669,
      emissive: 0x064e3b,
      emissiveIntensity: 0.6,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.3,
      thickness: 1.5,
      transparent: true,
      opacity: 0.95
    });
    const coreCube = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreCube);

    // Core Wireframe outline
    const wireGeo = new THREE.EdgesGeometry(coreGeo);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x34d399, linewidth: 2 });
    const coreWire = new THREE.LineSegments(wireGeo, wireMat);
    coreGroup.add(coreWire);

    // 2. Revolving Rings of Orbiting Cubes
    interface CubeData {
      mesh: THREE.Mesh;
      wireframe: THREE.LineSegments;
      orbitRadius: number;
      orbitSpeed: number;
      orbitAngle: number;
      orbitPlaneAngle: number; // inclination angle
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      initialScale: number;
    }

    const orbitingCubes: CubeData[] = [];
    const ringCount = 4;
    const cubesPerRing = [6, 10, 14, 18];
    const ringRadii = [6.5, 10.5, 14.5, 19.0];
    const ringSpeeds = [0.8, -0.55, 0.4, -0.3];
    const inclinations = [0.25, -0.4, 0.5, -0.2];

    const colors = [0x10b981, 0x06b6d4, 0x14b8a6, 0x34d399, 0x059669, 0x2dd4bf];

    ringRadii.forEach((radius, rIdx) => {
      const count = cubesPerRing[rIdx];
      const speed = ringSpeeds[rIdx];
      const inclination = inclinations[rIdx];

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const cubeSize = 0.8 + Math.random() * 0.9;
        const geo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const col = colors[(i + rIdx) % colors.length];

        const mat = new THREE.MeshPhysicalMaterial({
          color: col,
          emissive: col,
          emissiveIntensity: 0.35,
          roughness: 0.2,
          metalness: 0.7,
          clearcoat: 0.8,
          transparent: true,
          opacity: 0.9
        });

        const mesh = new THREE.Mesh(geo, mat);

        // Edge wireframe for cyber futuristic glow
        const edgeGeo = new THREE.EdgesGeometry(geo);
        const edgeMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
        const edge = new THREE.LineSegments(edgeGeo, edgeMat);
        mesh.add(edge);

        scene.add(mesh);

        orbitingCubes.push({
          mesh,
          wireframe: edge,
          orbitRadius: radius + (Math.random() - 0.5) * 1.5,
          orbitSpeed: speed * (0.85 + Math.random() * 0.3),
          orbitAngle: angle,
          orbitPlaneAngle: inclination,
          rotSpeedX: (Math.random() - 0.5) * 0.04,
          rotSpeedY: (Math.random() - 0.5) * 0.04,
          rotSpeedZ: (Math.random() - 0.5) * 0.03,
          initialScale: cubeSize
        });
      }
    });

    // 3. Orbital Path Circles (Luminous Guide Rings)
    ringRadii.forEach((radius, idx) => {
      const ringGeo = new THREE.RingGeometry(radius - 0.04, radius + 0.04, 96);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.18 - idx * 0.03,
        side: THREE.DoubleSide
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2 + inclinations[idx];
      scene.add(ringMesh);
    });

    // 4. Subtle Background Particle Dust
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 60;
      particlePos[i + 1] = (Math.random() - 0.5) * 40;
      particlePos[i + 2] = (Math.random() - 0.5) * 60;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.25,
      transparent: true,
      opacity: 0.5
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 8;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / container.clientHeight) * 2 - 1);
      targetCameraX = mouseX * 6;
      targetCameraY = 8 + mouseY * 4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Rotate core cube
      coreGroup.rotation.x += 0.008;
      coreGroup.rotation.y += 0.012;
      coreGroup.rotation.z += 0.006;
      coreCube.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.04);

      // Camera smooth damping
      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetCameraY - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Animate orbiting cubes (both revolving around center AND rotating on axis)
      orbitingCubes.forEach(cube => {
        cube.orbitAngle += cube.orbitSpeed * delta;

        // Position on inclined orbital plane
        const cosAngle = Math.cos(cube.orbitAngle);
        const sinAngle = Math.sin(cube.orbitAngle);

        const x = cosAngle * cube.orbitRadius;
        const z = sinAngle * cube.orbitRadius;
        const y = sinAngle * cube.orbitRadius * Math.sin(cube.orbitPlaneAngle);

        cube.mesh.position.set(x, y, z);

        // Self-rotation on axes
        cube.mesh.rotation.x += cube.rotSpeedX;
        cube.mesh.rotation.y += cube.rotSpeedY;
        cube.mesh.rotation.z += cube.rotSpeedZ;
      });

      // Slowly rotate particle field
      particles.rotation.y += 0.0008;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <div ref={mountRef} className="w-full h-full pointer-events-auto" />
    </div>
  );
};
