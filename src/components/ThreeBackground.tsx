import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    // Particle Stars System
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const color1 = new THREE.Color("#3B82F6"); // Primary Blue
    const color2 = new THREE.Color("#06B6D4"); // Cyan
    const color3 = new THREE.Color("#8B5CF6"); // Purple Accent

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 70;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 70;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

      const mixColor = Math.random() > 0.5 ? (Math.random() > 0.5 ? color1 : color2) : color3;
      colors[i * 3] = mixColor.r;
      colors[i * 3 + 1] = mixColor.g;
      colors[i * 3 + 2] = mixColor.b;

      sizes[i] = Math.random() * 2.5 + 0.5;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(geometry, particleMaterial);
    scene.add(particleSystem);

    // Floating Glass Spheres Group
    const spheresGroup = new THREE.Group();

    const sphereGeom = new THREE.SphereGeometry(1.2, 24, 24);
    const torusGeom = new THREE.TorusGeometry(2, 0.4, 12, 40);
    const octaGeom = new THREE.OctahedronGeometry(1.5, 1);

    const materials = [
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#3B82F6"),
        metalness: 0.2,
        roughness: 0.1,
        transparent: true,
        opacity: 0.4,
      }),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#8B5CF6"),
        metalness: 0.3,
        roughness: 0.15,
        transparent: true,
        opacity: 0.35,
      }),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#06B6D4"),
        metalness: 0.2,
        roughness: 0.1,
        transparent: true,
        opacity: 0.35,
      }),
    ];

    // Create floating 3D shapes
    const shapes: THREE.Mesh[] = [];
    const shapeConfigs = [
      { geom: sphereGeom, mat: materials[0], pos: [-12, 6, -5] },
      { geom: torusGeom, mat: materials[1], pos: [14, -4, -8] },
      { geom: octaGeom, mat: materials[2], pos: [-10, -8, -6] },
      { geom: sphereGeom, mat: materials[1], pos: [10, 8, -10] },
      { geom: octaGeom, mat: materials[0], pos: [16, 2, -12] },
      { geom: torusGeom, mat: materials[2], pos: [-14, 2, -14] },
    ];

    shapeConfigs.forEach((config) => {
      const mesh = new THREE.Mesh(config.geom, config.mat);
      mesh.position.set(config.pos[0], config.pos[1], config.pos[2]);
      spheresGroup.add(mesh);
      shapes.push(mesh);
    });

    scene.add(spheresGroup);

    // Ambient and Point Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 4, 50);
    blueLight.position.set(10, 10, 10);
    scene.add(blueLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 4, 50);
    purpleLight.position.set(-10, -10, 10);
    scene.add(purpleLight);

    // Mouse & Scroll Parallax State
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollY = 0;
    let targetScrollY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(event.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Animation Loop using performance.now() to avoid THREE.Clock deprecation warning
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      const elapsedTime = (performance.now() - startTime) / 1000;

      // Fast, snappy lerp interpolation
      targetX += (mouseX - targetX) * 0.1;
      targetY += (mouseY - targetY) * 0.1;
      targetScrollY += (scrollY - targetScrollY) * 0.15;

      const scrollFactor = targetScrollY * 0.005;

      // Camera 3D Parallax Movement on Scroll
      camera.position.y = -scrollFactor * 1.5;
      camera.rotation.x = scrollFactor * 0.03;

      // Rotate particle field on scroll & time
      particleSystem.rotation.y = elapsedTime * 0.02 + targetX * 0.3 + scrollFactor * 0.2;
      particleSystem.rotation.x = elapsedTime * 0.01 + targetY * 0.3;
      particleSystem.rotation.z = scrollFactor * 0.15;

      // Animate floating shapes
      shapes.forEach((shape, idx) => {
        shape.rotation.x += 0.005 * (idx + 1);
        shape.rotation.y += 0.007 * (idx + 1);
        shape.position.y += Math.sin(elapsedTime * 0.8 + idx) * 0.008;
      });

      spheresGroup.rotation.y = targetX * 0.2 + scrollFactor * 0.1;
      spheresGroup.rotation.x = -targetY * 0.2;
      spheresGroup.rotation.z = scrollFactor * 0.05;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* Aurora Ambient Glow Layer */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-blob pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-purple-600/15 rounded-full blur-3xl animate-blob [animation-delay:4s] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-[28rem] h-[28rem] bg-cyan-500/15 rounded-full blur-3xl animate-blob [animation-delay:2s] pointer-events-none" />

      {/* Subtle Mesh Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.4) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
};

export default ThreeBackground;
