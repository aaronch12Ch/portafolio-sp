"use client";

import { useEffect, useRef, useState } from "react";

export default function TechSphere() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const init = async () => {
      try {
        const THREE = await import("three");

        const width = containerRef.current!.clientWidth;
        const height = containerRef.current!.clientHeight;

        console.log("Container size:", width, height);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.z = 6;

        const renderer = new THREE.WebGLRenderer({ 
          alpha: true, 
          antialias: true 
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 0);
        containerRef.current!.appendChild(renderer.domElement);

        // Cubo de prueba MUY VISIBLE
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshBasicMaterial({ 
          color: 0x00ff00, // Verde brillante
          wireframe: true 
        });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        setIsLoaded(true);

        const animate = () => {
          requestAnimationFrame(animate);
          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;
          renderer.render(scene, camera);
        };

        animate();

        const onResize = () => {
          const w = containerRef.current!.clientWidth;
          const h = containerRef.current!.clientHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };

        window.addEventListener("resize", onResize);

        return () => {
          window.removeEventListener("resize", onResize);
          renderer.dispose();
        };
      } catch (err) {
        console.error("Error:", err);
      }
    };

    init();
  }, []);

  return (
    <div className="relative w-full h-full bg-primary-foreground/5 rounded-lg overflow-visible">
      <div ref={containerRef} className="w-full h-full" />
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-primary-foreground">Cargando 3D...</div>
        </div>
      )}
    </div>
  );
}