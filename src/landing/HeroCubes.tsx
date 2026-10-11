import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroCubesProps {
  className?: string;
}

export const HeroCubes: React.FC<HeroCubesProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Lights (Cool cyan to royal blue neon ambient & point lights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.5); // Sky cyan
    keyLight.position.set(5, 8, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x3d63ff, 2.0); // Royal blue accent
    fillLight.position.set(-6, -4, -4);
    scene.add(fillLight);

    const pointLight = new THREE.PointLight(0x60a5fa, 3, 20);
    pointLight.position.set(0, 0, 4);
    scene.add(pointLight);

    // 3. Cluster of translucent blue glass cubes (4x4x4 grid with random gaps)
    const clusterGroup = new THREE.Group();
    scene.add(clusterGroup);

    const cubeGeo = new THREE.BoxGeometry(0.85, 0.85, 0.85);
    const edgesGeo = new THREE.EdgesGeometry(cubeGeo);

    // Palette of cyan to deep royal blue glass materials
    const blueColors = [
      0x0284c7, // Sky 600
      0x0ea5e9, // Sky 500
      0x38bdf8, // Sky 400
      0x2563eb, // Blue 600
      0x3d63ff, // Primary accent blue
      0x1d4ed8, // Blue 700
      0x60a5fa, // Blue 400
    ];

    const materials: THREE.MeshPhysicalMaterial[] = blueColors.map((color) => {
      return new THREE.MeshPhysicalMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.15,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.75, // Translucent glass
        thickness: 1.2,
        transparent: true,
        opacity: 0.88,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      });
    });

    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      linewidth: 1.5,
    });

    // Seeded random distribution in 4x4x4 grid with deliberate gaps (occupancy ~50%)
    let seed = 42;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const cubesList: Array<{
      mesh: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      wobbleSpeed: number;
      wobbleOffset: number;
    }> = [];

    const spacing = 1.15;
    const offset = 1.5 * spacing; // Center 4 cubes around origin

    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        for (let z = 0; z < 4; z++) {
          // Leave random gaps to create an interesting architectural cluster
          if (rnd() > 0.48) {
            const posX = x * spacing - offset;
            const posY = y * spacing - offset;
            const posZ = z * spacing - offset;

            const matIndex = Math.floor(rnd() * materials.length);
            const cubeMesh = new THREE.Mesh(cubeGeo, materials[matIndex]);
            cubeMesh.position.set(posX, posY, posZ);

            // Add sharp white edge highlights
            const line = new THREE.LineSegments(edgesGeo, edgeMat);
            cubeMesh.add(line);

            clusterGroup.add(cubeMesh);

            cubesList.push({
              mesh: cubeMesh,
              baseX: posX,
              baseY: posY,
              baseZ: posZ,
              wobbleSpeed: 0.5 + rnd() * 0.8,
              wobbleOffset: rnd() * Math.PI * 2,
            });
          }
        }
      }
    }

    // 4. Mouse Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetMouseX = x * 1.5;
      targetMouseY = y * 1.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 5. Animation loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse parallax lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Slow elegant continuous rotation + mouse parallax tilt
      clusterGroup.rotation.y = elapsedTime * 0.22 + currentMouseX;
      clusterGroup.rotation.x = Math.sin(elapsedTime * 0.15) * 0.2 - currentMouseY;
      clusterGroup.rotation.z = Math.cos(elapsedTime * 0.18) * 0.1;

      // Subtle breathing motion for individual cubes
      cubesList.forEach((item) => {
        const floatDelta = Math.sin(elapsedTime * item.wobbleSpeed + item.wobbleOffset) * 0.04;
        item.mesh.position.y = item.baseY + floatDelta;
      });

      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 7. Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);

      cubeGeo.dispose();
      edgesGeo.dispose();
      edgeMat.dispose();
      materials.forEach((m) => m.dispose());
      renderer.dispose();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full min-h-[380px] pointer-events-auto flex items-center justify-center ${className}`}
    />
  );
};
