import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Student } from '../../types/student';
import {
  Sparkles,
  Maximize2,
  RotateCw,
  Box,
  Dna,
  Share2,
  CircleDot,
  Activity,
  Compass,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Sliders,
  Layers,
  Eye,
  RefreshCw,
  Atom
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Structure3DType, STRUCTURE_CATALOG } from '../../types/theme';

interface SpatialClusterSceneProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const SpatialClusterScene: React.FC<SpatialClusterSceneProps> = ({
  students,
  onSelectStudent,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredStudent, setHoveredStudent] = useState<Student | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'critical' | 'kpmg'>('all');
  const [isRotating, setIsRotating] = useState(true);

  const {
    structureType,
    setStructureType,
    currentThemeConfig,
    setIsStructureModalOpen,
  } = useTheme();

  // Reference to reset camera
  const resetCameraRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 450;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(currentThemeConfig.threeJs.fogColor, 0.012);

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(28, 22, 38);
    camera.lookAt(0, 3, 0);

    resetCameraRef.current = () => {
      camera.position.set(28, 22, 38);
      camera.lookAt(0, 3, 0);
    };

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.replaceChildren(renderer.domElement);

    // 2. Dynamic Lighting from Active Theme
    const ambientLight = new THREE.AmbientLight(currentThemeConfig.threeJs.ambientColor, 1.1);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(currentThemeConfig.threeJs.dirLight1, 2.8);
    dirLight1.position.set(30, 40, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(currentThemeConfig.threeJs.dirLight2, 2.2);
    dirLight2.position.set(-30, -20, -20);
    scene.add(dirLight2);

    // 3. Ground Grid Helper & Floor Ring
    const gridHelper = new THREE.GridHelper(
      54,
      28,
      currentThemeConfig.threeJs.gridPrimary,
      currentThemeConfig.threeJs.gridSecondary
    );
    gridHelper.position.y = -8;
    scene.add(gridHelper);

    const ringGeo = new THREE.TorusGeometry(24, 0.08, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: currentThemeConfig.threeJs.gridPrimary,
      transparent: true,
      opacity: 0.35,
    });
    const floorRing = new THREE.Mesh(ringGeo, ringMat);
    floorRing.rotation.x = Math.PI / 2;
    floorRing.position.y = -8;
    scene.add(floorRing);

    // 4. Background Starfield / Particle Cloud
    const particleCount = 220;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = Math.random() * 45 - 10;
      positions[i + 2] = (Math.random() - 0.5) * 100;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: currentThemeConfig.threeJs.particleColor,
      size: 0.5,
      transparent: true,
      opacity: 0.55,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Structure-Specific Geometry & Student 3D Holographic Nodes
    const studentMeshMap = new Map<THREE.Mesh, Student>();
    const nodeGroup = new THREE.Group();
    const structureDecorGroup = new THREE.Group();

    // Filter students
    const visibleStudents = students.filter((s) => {
      if (filterMode === 'critical' && s.riskLevel !== 'Critical') return false;
      if (filterMode === 'kpmg' && s.placementEligibility !== 'Eligible') return false;
      return true;
    });

    // Helper to calculate student node colors
    const getNodeColors = (student: Student) => {
      let nodeColor = 0x06b6d4; // Cyan (Low Risk)
      let auraColor = 0x22d3ee;
      if (student.riskLevel === 'Critical') {
        nodeColor = 0xf43f5e; // Crimson Neon
        auraColor = 0xfb7185;
      } else if (student.riskLevel === 'Moderate') {
        nodeColor = 0xf59e0b; // Amber Neon
        auraColor = 0xfbbf24;
      } else if (student.riskLevel === 'Exemplary') {
        nodeColor = 0x10b981; // Emerald
        auraColor = 0x34d399;
      }
      return { nodeColor, auraColor };
    };

    // Build chosen 3D structure
    if (structureType === 'atom') {
      // Structure 1: Quantum Atom Orbital Model (Nucleus + Multi-Planar Electron Shells)
      // 1. Central Nucleus Cluster (Protons & Neutrons)
      const nucleusGroup = new THREE.Group();
      nucleusGroup.position.set(0, 3, 0);

      // Core pulsating sun/nucleus
      const coreSphereGeo = new THREE.SphereGeometry(2.4, 24, 24);
      const coreSphereMat = new THREE.MeshStandardMaterial({
        color: 0x10b981, // Emerald core
        emissive: 0x059669,
        emissiveIntensity: 1.1,
        roughness: 0.2,
      });
      nucleusGroup.add(new THREE.Mesh(coreSphereGeo, coreSphereMat));

      // Nucleon particles cluster
      const nucleonCount = 12;
      for (let i = 0; i < nucleonCount; i++) {
        const nGeo = new THREE.SphereGeometry(0.75, 16, 16);
        const isProton = i % 2 === 0;
        const nMat = new THREE.MeshStandardMaterial({
          color: isProton ? 0x34d399 : 0x06b6d4,
          emissive: isProton ? 0x10b981 : 0x0891b2,
          emissiveIntensity: 0.85,
        });
        const nMesh = new THREE.Mesh(nGeo, nMat);
        const theta = (i / nucleonCount) * Math.PI * 2;
        const phi = Math.acos(((i % 5) - 2) / 3);
        const dist = 1.8;
        nMesh.position.set(
          dist * Math.sin(phi) * Math.cos(theta),
          dist * Math.cos(phi),
          dist * Math.sin(phi) * Math.sin(theta)
        );
        nucleusGroup.add(nMesh);
      }
      structureDecorGroup.add(nucleusGroup);

      // 2. Multi-Planar Quantum Electron Orbital Rings (Tilted 3D Planes)
      const orbitalPlanes = [
        { radiusX: 18, radiusY: 9.5, rotX: Math.PI / 3, rotY: 0, rotZ: Math.PI / 6 },
        { radiusX: 19, radiusY: 10.5, rotX: -Math.PI / 3, rotY: Math.PI / 4, rotZ: -Math.PI / 5 },
        { radiusX: 20, radiusY: 11, rotX: Math.PI / 6, rotY: -Math.PI / 3, rotZ: Math.PI / 3 },
        { radiusX: 21, radiusY: 11.5, rotX: 0, rotY: Math.PI / 2.2, rotZ: Math.PI / 4 },
        { radiusX: 22, radiusY: 12, rotX: Math.PI / 2.5, rotY: Math.PI / 1.8, rotZ: -Math.PI / 3 },
      ];

      orbitalPlanes.forEach((plane, pIdx) => {
        const curve = new THREE.EllipseCurve(
          0, 0,
          plane.radiusX, plane.radiusY,
          0, 2 * Math.PI,
          false,
          0
        );
        const points = curve.getPoints(120);
        const orbitGeo = new THREE.BufferGeometry().setFromPoints(
          points.map(p => new THREE.Vector3(p.x, p.y, 0))
        );
        const orbitMat = new THREE.LineBasicMaterial({
          color: pIdx % 2 === 0 ? currentThemeConfig.threeJs.dirLight1 : currentThemeConfig.threeJs.dirLight2,
          transparent: true,
          opacity: 0.45,
        });
        const orbitLine = new THREE.Line(orbitGeo, orbitMat);
        orbitLine.rotation.set(plane.rotX, plane.rotY, plane.rotZ);
        orbitLine.position.set(0, 3, 0);
        structureDecorGroup.add(orbitLine);
      });

      // 3. Place Students as Quantum Electrons on the Orbital Shells
      visibleStudents.forEach((student, index) => {
        const planeIdx = index % orbitalPlanes.length;
        const plane = orbitalPlanes[planeIdx];

        const totalOnPlane = Math.ceil(visibleStudents.length / orbitalPlanes.length);
        const planeStudentIdx = Math.floor(index / orbitalPlanes.length);
        const angle = (planeStudentIdx / Math.max(totalOnPlane, 1)) * Math.PI * 2 + (planeIdx * 0.7);

        // Students with critical risk orbit closer (inner shell), high performers orbit in outer valence
        const energyMultiplier = student.riskLevel === 'Critical' ? 0.75 : student.riskLevel === 'Moderate' ? 0.9 : 1.1;
        const localX = Math.cos(angle) * (plane.radiusX * energyMultiplier);
        const localY = Math.sin(angle) * (plane.radiusY * energyMultiplier);
        const localZ = 0;

        const posVector = new THREE.Vector3(localX, localY, localZ);
        const euler = new THREE.Euler(plane.rotX, plane.rotY, plane.rotZ, 'XYZ');
        posVector.applyEuler(euler);
        posVector.y += 3; // match nucleus center

        const { nodeColor, auraColor } = getNodeColors(student);

        // Electron Sphere Mesh
        const sphereGeo = new THREE.SphereGeometry(student.riskLevel === 'Critical' ? 1.4 : 1.15, 24, 24);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: nodeColor,
          emissive: nodeColor,
          emissiveIntensity: 0.85,
          roughness: 0.2,
          metalness: 0.8,
        });
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.copy(posVector);

        // Electron Wave Halo
        const haloGeo = new THREE.TorusGeometry(1.6, 0.06, 12, 32);
        const haloMat = new THREE.MeshBasicMaterial({
          color: auraColor,
          transparent: true,
          opacity: 0.5,
        });
        const electronHalo = new THREE.Mesh(haloGeo, haloMat);
        electronHalo.rotation.x = Math.PI / 3;
        mesh.add(electronHalo);

        // Quantum Ray to Nucleus
        const rayGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(-posVector.x, 3 - posVector.y, -posVector.z),
        ]);
        const rayMat = new THREE.LineBasicMaterial({
          color: auraColor,
          transparent: true,
          opacity: 0.18,
        });
        mesh.add(new THREE.Line(rayGeo, rayMat));

        nodeGroup.add(mesh);
        studentMeshMap.set(mesh, student);
      });
    } else if (structureType === 'helix') {
      // Structure 2: Double Helix Spiral
      // Create decorative dual spiral backbone curves
      const helixPoints1: THREE.Vector3[] = [];
      const helixPoints2: THREE.Vector3[] = [];
      const helixHeight = 28;
      const helixRadius = 14;
      const turns = 3.5;

      for (let i = 0; i <= 200; i++) {
        const t = (i / 200) * (Math.PI * 2 * turns);
        const y = (i / 200) * helixHeight - 7;
        helixPoints1.push(new THREE.Vector3(Math.cos(t) * helixRadius, y, Math.sin(t) * helixRadius));
        helixPoints2.push(new THREE.Vector3(Math.cos(t + Math.PI) * helixRadius, y, Math.sin(t + Math.PI) * helixRadius));
      }

      const curve1 = new THREE.CatmullRomCurve3(helixPoints1);
      const tubeGeo1 = new THREE.TubeGeometry(curve1, 100, 0.18, 8, false);
      const tubeMat1 = new THREE.MeshBasicMaterial({
        color: currentThemeConfig.threeJs.dirLight1,
        transparent: true,
        opacity: 0.6,
      });
      structureDecorGroup.add(new THREE.Mesh(tubeGeo1, tubeMat1));

      const curve2 = new THREE.CatmullRomCurve3(helixPoints2);
      const tubeGeo2 = new THREE.TubeGeometry(curve2, 100, 0.18, 8, false);
      const tubeMat2 = new THREE.MeshBasicMaterial({
        color: currentThemeConfig.threeJs.dirLight2,
        transparent: true,
        opacity: 0.6,
      });
      structureDecorGroup.add(new THREE.Mesh(tubeGeo2, tubeMat2));

      // Distribute students along the dual helix strands
      visibleStudents.forEach((student, index) => {
        const isStrandA = index % 2 === 0;
        const progress = (index / Math.max(visibleStudents.length - 1, 1));
        const theta = progress * (Math.PI * 2 * turns) + (isStrandA ? 0 : Math.PI);
        const y = progress * helixHeight - 7;
        const radius = helixRadius + (student.riskLevel === 'Critical' ? -2 : 1);

        const posX = Math.cos(theta) * radius;
        const posY = y;
        const posZ = Math.sin(theta) * radius;

        const { nodeColor, auraColor } = getNodeColors(student);

        const sphereGeo = new THREE.SphereGeometry(student.riskLevel === 'Critical' ? 1.4 : 1.15, 20, 20);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: nodeColor,
          emissive: nodeColor,
          emissiveIntensity: 0.8,
          roughness: 0.25,
        });
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.set(posX, posY, posZ);

        // Helical cross-rung connecting to opposite strand
        const oppX = Math.cos(theta + Math.PI) * radius;
        const oppZ = Math.sin(theta + Math.PI) * radius;
        const rungGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(oppX - posX, 0, oppZ - posZ),
        ]);
        const rungMat = new THREE.LineBasicMaterial({
          color: auraColor,
          transparent: true,
          opacity: 0.25,
        });
        mesh.add(new THREE.Line(rungGeo, rungMat));

        nodeGroup.add(mesh);
        studentMeshMap.set(mesh, student);
      });
    } else if (structureType === 'constellation') {
      // Structure 3: Neural Constellation Geodesic Orb
      const sphereRadius = 16;
      // Geodesic wireframe sphere cage
      const icosaGeo = new THREE.IcosahedronGeometry(sphereRadius, 2);
      const icosaMat = new THREE.MeshBasicMaterial({
        color: currentThemeConfig.threeJs.dirLight1,
        wireframe: true,
        transparent: true,
        opacity: 0.18,
      });
      structureDecorGroup.add(new THREE.Mesh(icosaGeo, icosaMat));

      // Place students along spherical Fibonacci spiral
      const phi = (1 + Math.sqrt(5)) / 2;
      const total = visibleStudents.length;

      const nodePositions: THREE.Vector3[] = [];

      visibleStudents.forEach((student, index) => {
        const y = 1 - (index / Math.max(total - 1, 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = (2 * Math.PI * index) / phi;

        const posX = Math.cos(theta) * radiusAtY * (sphereRadius + (student.cgpa - 7.5) * 1.5);
        const posY = y * sphereRadius + 4;
        const posZ = Math.sin(theta) * radiusAtY * (sphereRadius + (student.cgpa - 7.5) * 1.5);

        const currentPos = new THREE.Vector3(posX, posY, posZ);
        nodePositions.push(currentPos);

        const { nodeColor, auraColor } = getNodeColors(student);

        const sphereGeo = new THREE.SphereGeometry(student.riskLevel === 'Critical' ? 1.4 : 1.15, 20, 20);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: nodeColor,
          emissive: nodeColor,
          emissiveIntensity: 0.8,
        });
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.copy(currentPos);

        // Core halo
        const haloGeo = new THREE.RingGeometry(1.4, 1.8, 16);
        const haloMat = new THREE.MeshBasicMaterial({
          color: auraColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.4,
        });
        const ring = new THREE.Mesh(haloGeo, haloMat);
        ring.lookAt(0, 4, 0);
        mesh.add(ring);

        nodeGroup.add(mesh);
        studentMeshMap.set(mesh, student);
      });

      // Neural connection filaments between nearby nodes
      const linePositions: number[] = [];
      for (let i = 0; i < nodePositions.length; i++) {
        for (let j = i + 1; j < nodePositions.length; j++) {
          const dist = nodePositions[i].distanceTo(nodePositions[j]);
          if (dist < 11) {
            linePositions.push(
              nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
              nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
            );
          }
        }
      }
      if (linePositions.length > 0) {
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        const lineMat = new THREE.LineBasicMaterial({
          color: currentThemeConfig.threeJs.dirLight2,
          transparent: true,
          opacity: 0.22,
        });
        structureDecorGroup.add(new THREE.LineSegments(lineGeo, lineMat));
      }
    } else if (structureType === 'orbit') {
      // Structure 4: Solar Gravitational Orbits
      // Central glowing KPMG Star / Success Core
      const sunGeo = new THREE.SphereGeometry(2.8, 24, 24);
      const sunMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        emissive: 0xf59e0b,
        emissiveIntensity: 1.2,
      });
      const sun = new THREE.Mesh(sunGeo, sunMat);
      sun.position.set(0, 3, 0);
      structureDecorGroup.add(sun);

      // Central corona ring
      const coronaGeo = new THREE.TorusGeometry(3.6, 0.1, 16, 64);
      const coronaMat = new THREE.MeshBasicMaterial({
        color: 0xfcd34d,
        transparent: true,
        opacity: 0.6,
      });
      const corona = new THREE.Mesh(coronaGeo, coronaMat);
      corona.rotation.x = Math.PI / 2;
      corona.position.set(0, 3, 0);
      structureDecorGroup.add(corona);

      // 4 Concentric Orbit Track Rings
      const orbitRadii = {
        critical: 7.5,    // Danger inner orbit
        moderate: 12.5,   // Middle warning orbit
        low: 17.5,        // Outer safe orbit
        exemplary: 22.5,  // Apex crown orbit
      };

      Object.entries(orbitRadii).forEach(([level, radius]) => {
        const trackGeo = new THREE.TorusGeometry(radius, 0.07, 16, 120);
        let trackColor = 0x06b6d4;
        if (level === 'critical') trackColor = 0xf43f5e;
        else if (level === 'moderate') trackColor = 0xf59e0b;
        else if (level === 'exemplary') trackColor = 0x10b981;

        const trackMat = new THREE.MeshBasicMaterial({
          color: trackColor,
          transparent: true,
          opacity: 0.35,
        });
        const track = new THREE.Mesh(trackGeo, trackMat);
        track.rotation.x = Math.PI / 2;
        track.position.set(0, 3, 0);
        structureDecorGroup.add(track);
      });

      // Distribute students on their respective orbital rings
      const countsByLevel: Record<string, number> = { critical: 0, moderate: 0, low: 0, exemplary: 0 };
      visibleStudents.forEach((student) => {
        const key = student.riskLevel === 'Critical' ? 'critical' :
                    student.riskLevel === 'Moderate' ? 'moderate' :
                    student.riskLevel === 'Exemplary' ? 'exemplary' : 'low';
        countsByLevel[key] = (countsByLevel[key] || 0) + 1;
      });

      const indicesByLevel: Record<string, number> = { critical: 0, moderate: 0, low: 0, exemplary: 0 };

      visibleStudents.forEach((student) => {
        const key = student.riskLevel === 'Critical' ? 'critical' :
                    student.riskLevel === 'Moderate' ? 'moderate' :
                    student.riskLevel === 'Exemplary' ? 'exemplary' : 'low';
        const r = orbitRadii[key as keyof typeof orbitRadii];
        const idx = indicesByLevel[key]++;
        const totalInOrbit = countsByLevel[key] || 1;
        const angle = (idx / totalInOrbit) * Math.PI * 2;

        const posX = Math.cos(angle) * r;
        const posY = 3 + Math.sin(angle * 2) * 1.2;
        const posZ = Math.sin(angle) * r;

        const { nodeColor, auraColor } = getNodeColors(student);

        const sphereGeo = new THREE.SphereGeometry(student.riskLevel === 'Critical' ? 1.4 : 1.15, 20, 20);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: nodeColor,
          emissive: nodeColor,
          emissiveIntensity: 0.8,
        });
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.set(posX, posY, posZ);

        // Planetary axis ring
        const orbitRingGeo = new THREE.TorusGeometry(1.6, 0.05, 8, 24);
        const orbitRingMat = new THREE.MeshBasicMaterial({
          color: auraColor,
          transparent: true,
          opacity: 0.4,
        });
        const pRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
        pRing.rotation.x = Math.PI / 4;
        mesh.add(pRing);

        nodeGroup.add(mesh);
        studentMeshMap.set(mesh, student);
      });
    } else if (structureType === 'terrain') {
      // Structure 5: Topological Cyber Waveform Terrain
      const gridSegments = 24;
      const planeSize = 36;
      const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize, gridSegments, gridSegments);
      planeGeo.rotateX(-Math.PI / 2);

      const posAttr = planeGeo.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const z = posAttr.getZ(i);
        const elevation = Math.sin(x * 0.25) * Math.cos(z * 0.25) * 3;
        posAttr.setY(i, elevation - 3);
      }
      planeGeo.computeVertexNormals();

      const wireframeMat = new THREE.MeshBasicMaterial({
        color: currentThemeConfig.threeJs.dirLight1,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      });
      structureDecorGroup.add(new THREE.Mesh(planeGeo, wireframeMat));

      // Place students across terrain grid
      visibleStudents.forEach((student, index) => {
        const cols = Math.ceil(Math.sqrt(visibleStudents.length));
        const row = Math.floor(index / cols);
        const col = index % cols;

        const posX = ((col / Math.max(cols - 1, 1)) - 0.5) * (planeSize * 0.8);
        const posZ = ((row / Math.max(cols - 1, 1)) - 0.5) * (planeSize * 0.8);
        // Elevation determined by CGPA & risk: high CGPA sits on peaks, critical sits in valleys
        const terrainY = Math.sin(posX * 0.25) * Math.cos(posZ * 0.25) * 3 - 3;
        const academicElevation = ((student.cgpa - 4) / 6) * 12;
        const posY = terrainY + academicElevation;

        const { nodeColor, auraColor } = getNodeColors(student);

        const sphereGeo = new THREE.SphereGeometry(student.riskLevel === 'Critical' ? 1.4 : 1.15, 20, 20);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: nodeColor,
          emissive: nodeColor,
          emissiveIntensity: 0.8,
        });
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.set(posX, posY, posZ);

        // Elevation stalk down to terrain surface
        const stalkGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, terrainY - posY, 0),
        ]);
        const stalkMat = new THREE.LineBasicMaterial({
          color: nodeColor,
          transparent: true,
          opacity: 0.4,
        });
        mesh.add(new THREE.Line(stalkGeo, stalkMat));

        nodeGroup.add(mesh);
        studentMeshMap.set(mesh, student);
      });
    } else if (structureType === 'radar') {
      // Structure 6: Cylindrical Radar Tower with 360° Sweep
      const cylinderHeight = 26;
      const cylinderRadius = 15;

      // 4 Floor Discs for Academic Years
      for (let yLevel = 0; yLevel < 4; yLevel++) {
        const diskY = (yLevel / 3) * cylinderHeight - 6;
        const diskGeo = new THREE.RingGeometry(2, cylinderRadius, 32);
        const diskMat = new THREE.MeshBasicMaterial({
          color: currentThemeConfig.threeJs.dirLight2,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.15,
        });
        const disk = new THREE.Mesh(diskGeo, diskMat);
        disk.rotation.x = Math.PI / 2;
        disk.position.set(0, diskY, 0);
        structureDecorGroup.add(disk);

        // Disc perimeter ring
        const perimeterGeo = new THREE.TorusGeometry(cylinderRadius, 0.08, 12, 48);
        const perimeterMat = new THREE.MeshBasicMaterial({
          color: currentThemeConfig.threeJs.dirLight1,
          transparent: true,
          opacity: 0.4,
        });
        const perim = new THREE.Mesh(perimeterGeo, perimeterMat);
        perim.rotation.x = Math.PI / 2;
        perim.position.set(0, diskY, 0);
        structureDecorGroup.add(perim);
      }

      // Central Pillar
      const pillarGeo = new THREE.CylinderGeometry(0.5, 0.5, cylinderHeight + 4, 16);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: currentThemeConfig.threeJs.dirLight1,
        metalness: 0.8,
        roughness: 0.2,
      });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(0, 6, 0);
      structureDecorGroup.add(pillar);

      // Distribute students by academic year (height) & department / performance angle
      const deptAngles: Record<string, number> = {
        'Computer Science': 0,
        'Information Technology': Math.PI / 2,
        'AI & Data Science': Math.PI,
        'Electronics & Comm': (Math.PI * 3) / 2,
      };

      visibleStudents.forEach((student) => {
        const baseAngle = deptAngles[student.department] || 0;
        const jitter = ((student.cgpa - 7) / 3) * 0.5;
        const angle = baseAngle + jitter;
        const diskY = ((student.year - 1) / 3) * cylinderHeight - 6;

        // Radius: Critical risk pushed toward center radar warning zone
        const r = ((student.riskScore) / 100) * (cylinderRadius - 3) + 3;

        const posX = Math.cos(angle) * r;
        const posY = diskY;
        const posZ = Math.sin(angle) * r;

        const { nodeColor, auraColor } = getNodeColors(student);

        const sphereGeo = new THREE.SphereGeometry(student.riskLevel === 'Critical' ? 1.4 : 1.15, 20, 20);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: nodeColor,
          emissive: nodeColor,
          emissiveIntensity: 0.8,
        });
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.set(posX, posY, posZ);

        // Ray to central pillar
        const rayGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(-posX, 0, -posZ),
        ]);
        const rayMat = new THREE.LineBasicMaterial({
          color: auraColor,
          transparent: true,
          opacity: 0.2,
        });
        mesh.add(new THREE.Line(rayGeo, rayMat));

        nodeGroup.add(mesh);
        studentMeshMap.set(mesh, student);
      });
    }

    scene.add(structureDecorGroup);
    scene.add(nodeGroup);

    // 6. Interactive Raycasting & Mouse Orbit
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        nodeGroup.rotation.y += deltaX * 0.008;
        structureDecorGroup.rotation.y += deltaX * 0.008;
        nodeGroup.rotation.x = Math.max(-0.4, Math.min(0.6, nodeGroup.rotation.x + deltaY * 0.005));
        structureDecorGroup.rotation.x = nodeGroup.rotation.x;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeGroup.children);
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const student = studentMeshMap.get(hit);
        if (student) {
          onSelectStudent(student);
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('click', onClick);

    // 7. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isRotating && !isDragging) {
        nodeGroup.rotation.y += 0.0022;
        structureDecorGroup.rotation.y += 0.0022;
      }

      // Gentle floating breathing animation on nodes
      nodeGroup.children.forEach((child, i) => {
        child.position.y += Math.sin(elapsedTime * 2 + i) * 0.012;
      });

      // Raycast check for hover HUD
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeGroup.children);
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const s = studentMeshMap.get(hit);
        if (s) setHoveredStudent(s);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('mousedown', onMouseDown);
      dom.removeEventListener('click', onClick);
      renderer.dispose();
    };
  }, [students, filterMode, isRotating, structureType, currentThemeConfig]);

  const activeStructureMeta =
    STRUCTURE_CATALOG.find((s) => s.id === structureType) || STRUCTURE_CATALOG[0];

  const quickStructureButtons: { id: Structure3DType; name: string; icon: React.ReactNode }[] = [
    { id: 'atom', name: 'Atom Model', icon: <Atom className="w-3.5 h-3.5" /> },
    { id: 'helix', name: 'Double Helix', icon: <Dna className="w-3.5 h-3.5" /> },
    { id: 'constellation', name: 'Neural Sphere', icon: <Share2 className="w-3.5 h-3.5" /> },
    { id: 'orbit', name: 'Solar Orbit', icon: <CircleDot className="w-3.5 h-3.5" /> },
    { id: 'terrain', name: 'Cyber Wave', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'radar', name: 'Radar Tower', icon: <Compass className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="relative w-full h-[520px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-3xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden group">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Hologram Overlay Header with Active Structure Title */}
      <div className="absolute top-4 left-4 z-10 pointer-events-auto">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/80 border border-cyan-500/40 px-2.5 py-0.5 rounded-full shadow-lg">
            3D Spatial Analytics
          </span>
          <span className="text-[11px] font-bold text-slate-300 bg-black/50 px-2 py-0.5 rounded-md border border-white/10">
            {activeStructureMeta.shortName}
          </span>
        </div>

        <h3 className="text-sm font-extrabold text-white flex items-center gap-2 drop-shadow">
          <span>{activeStructureMeta.title}</span>
        </h3>
        <p className="text-[11px] text-slate-400 mt-0.5 drop-shadow max-w-sm">
          {activeStructureMeta.mathFormula}
        </p>
      </div>

      {/* Top Right Controls & Filter Chips */}
      <div className="absolute top-4 right-4 z-10 flex flex-wrap items-center justify-end gap-2">
        {/* Filter Buttons */}
        <div className="flex bg-slate-900/90 border border-slate-700/80 rounded-xl p-1 backdrop-blur-md shadow-lg text-xs">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              filterMode === 'all'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterMode('critical')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              filterMode === 'critical'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            At-Risk
          </button>
          <button
            onClick={() => setFilterMode('kpmg')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              filterMode === 'kpmg'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            KPMG
          </button>
        </div>

        {/* Reset Camera View */}
        <button
          onClick={() => resetCameraRef.current?.()}
          className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-md"
          title="Reset Camera Angle"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Auto Rotation Toggle */}
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-2 rounded-xl border backdrop-blur-md transition-all cursor-pointer shadow-md ${
            isRotating
              ? 'bg-indigo-950/80 border-indigo-700 text-indigo-300'
              : 'bg-slate-900/80 border-slate-700 text-slate-400'
          }`}
          title="Toggle 3D Orbit Rotation"
        >
          <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Floating Structure Selector Toolbar at Bottom Center */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-auto">
        {/* Quick Structure Buttons */}
        <div className="flex items-center overflow-x-auto no-scrollbar gap-1 p-1 bg-slate-950/85 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl max-w-full">
          {quickStructureButtons.map((btn) => {
            const isSelected = structureType === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setStructureType(btn.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-400/40'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {btn.icon}
                <span>{btn.name}</span>
              </button>
            );
          })}

          {/* Showcase Gallery Trigger */}
          <button
            onClick={() => setIsStructureModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/70 hover:bg-purple-900/90 text-purple-300 border border-purple-500/40 font-bold text-xs whitespace-nowrap transition-all cursor-pointer ml-1 shadow-[0_0_12px_rgba(168,85,247,0.2)]"
            title="Browse all 3D structures with full math and descriptions"
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span>Browse 3D Gallery</span>
          </button>
        </div>

        {/* Legend */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-950/85 border border-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-xl text-[11px] text-slate-300 shadow-xl">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/80" />
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/80" />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/80" />
            <span>Low Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/80" />
            <span>Exemplary</span>
          </div>
        </div>
      </div>

      {/* Floating 3D Holographic HUD for Hovered / Targeted Student */}
      {hoveredStudent && (
        <div className="absolute top-20 right-4 z-20 w-80 bg-slate-950/95 border border-cyan-500/60 rounded-2xl p-3.5 shadow-2xl backdrop-blur-2xl animate-fadeIn text-xs">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5">
              <img
                src={hoveredStudent.avatar}
                alt={hoveredStudent.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400 shadow"
              />
              <div>
                <h4 className="font-bold text-white text-sm leading-tight">
                  {hoveredStudent.name}
                </h4>
                <span className="text-[11px] text-slate-400">
                  {hoveredStudent.rollNo} • {hoveredStudent.department}
                </span>
              </div>
            </div>

            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                hoveredStudent.riskLevel === 'Critical'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : hoveredStudent.riskLevel === 'Moderate'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}
            >
              {hoveredStudent.riskScore} Risk
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-900 rounded-xl text-center mb-2.5">
            <div>
              <span className="text-[10px] text-slate-400">CGPA</span>
              <div className="font-bold text-white text-xs">
                {hoveredStudent.cgpa.toFixed(2)}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Attendance</span>
              <div
                className={`font-bold text-xs ${
                  hoveredStudent.overallAttendance >= 75
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}
              >
                {hoveredStudent.overallAttendance}%
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Coding</span>
              <div className="font-bold text-indigo-400 text-xs">
                {hoveredStudent.codingProfile.byteXlScore}
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectStudent(hoveredStudent)}
            className="w-full py-1.5 px-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Launch AI 360° Diagnostics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
