"use client";

import { useEffect, useRef, useState } from "react";

export default function TechSphere() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let scene: any,
      camera: any,
      renderer: any,
      labels: any[] = [],
      raycaster: any,
      mouse: any;

    let mouseX = 0,
      mouseY = 0;
    let selectedLabel: any = null;

    const technologies = [
      ".NET",
      "SQL Server",
      "Spring Boot",
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Docker",
      "AWS",
      "Git",
      "Tailwind CSS",
    ];

    const init = async () => {
      const THREE = await import("three");

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        60,
        containerRef.current!.clientWidth / containerRef.current!.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 6;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });

      renderer.setSize(
        containerRef.current!.clientWidth,
        containerRef.current!.clientHeight
      );
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0);
      containerRef.current!.appendChild(renderer.domElement);

      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2();

      // Crear labels con texto curveado
      technologies.forEach((tech, index) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = 512;
        canvas.height = 256;

        // Dibujar texto curveado
        ctx.font = "bold 48px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Calcular curvatura
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 150; // Radio de curvatura del texto
        const angleRange = Math.PI * 0.8; // Rango de ángulo para el texto
        const startAngle = -angleRange / 2;

        // Dibujar cada letra en un arco
        for (let i = 0; i < tech.length; i++) {
          const char = tech[i];
          const angle = startAngle + (angleRange * i) / (tech.length - 1);
          
          ctx.save();
          ctx.translate(
            centerX + radius * Math.sin(angle),
            centerY - radius * Math.cos(angle) + 40
          );
          ctx.rotate(angle);
          ctx.fillText(char, 0, 0);
          ctx.restore();
        }

        const texture = new THREE.CanvasTexture(canvas);

        const material = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          opacity: 0.95,
        });

        const sprite = new THREE.Sprite(material);

        // Distribución esfera
        const phi = Math.acos(-1 + (2 * index) / technologies.length);
        const theta = Math.sqrt(technologies.length * Math.PI) * phi;

        const radius2 = 2.6;

        sprite.position.set(
          radius2 * Math.cos(theta) * Math.sin(phi),
          radius2 * Math.sin(theta) * Math.sin(phi),
          radius2 * Math.cos(phi)
        );

        sprite.scale.set(2, 1, 1);
        
        // Guardar escala original y datos
        sprite.userData = {
          originalScale: sprite.scale.clone(),
          originalPosition: sprite.position.clone(),
          techName: tech,
          isHovered: false,
          targetScale: sprite.scale.clone(),
        };

        scene.add(sprite);
        labels.push(sprite);
      });

      setIsLoaded(true);

      const onMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

        // Actualizar mouse para raycaster
        const rect = containerRef.current!.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      };

      const onTouchMove = (e: TouchEvent) => {
        if (!e.touches.length) return;

        const touch = e.touches[0];
        mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(touch.clientY / window.innerHeight) * 2 + 1;

        const rect = containerRef.current!.getBoundingClientRect();
        mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
      };

      const onClick = (e: MouseEvent | TouchEvent) => {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(labels);

        if (intersects.length > 0) {
          const clicked = intersects[0].object;
          
          // Alternar selección
          if (selectedLabel === clicked) {
            selectedLabel = null;
          } else {
            selectedLabel = clicked;
          }
        } else {
          selectedLabel = null;
        }
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("click", onClick);
      window.addEventListener("touchend", onClick);

      const animate = () => {
        requestAnimationFrame(animate);

        const rotX = mouseY * 0.3;
        const rotY = mouseX * 0.3;

        scene.rotation.x += (rotX - scene.rotation.x) * 0.05;
        scene.rotation.y += (rotY - scene.rotation.y) * 0.05;

        // Auto rotación
        const isMobile = window.innerWidth < 768;
        scene.rotation.y += isMobile ? 0.006 : 0.002;

        scene.rotation.x = Math.max(-0.6, Math.min(0.6, scene.rotation.x));

        // Detectar hover
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(labels);

        labels.forEach((label) => {
          const isIntersected = intersects.some((i) => i.object === label);
          const isSelected = label === selectedLabel;

          // Escala objetivo
          if (isSelected) {
            label.userData.targetScale = label.userData.originalScale.clone().multiplyScalar(2.5);
            label.material.opacity = 1;
          } else if (isIntersected) {
            label.userData.targetScale = label.userData.originalScale.clone().multiplyScalar(1.5);
            label.material.opacity = 1;
            containerRef.current!.style.cursor = 'pointer';
          } else {
            label.userData.targetScale = label.userData.originalScale.clone();
            label.material.opacity = 0.95;
          }

          // Lerp suave hacia escala objetivo
          label.scale.lerp(label.userData.targetScale, 0.1);

          // Siempre mirar a la cámara
          label.lookAt(camera.position);
        });

        // Reset cursor si no hay hover
        if (intersects.length === 0) {
          containerRef.current!.style.cursor = 'default';
        }

        renderer.render(scene, camera);
      };

      animate();

      const onResize = () => {
        camera.aspect =
          containerRef.current!.clientWidth / containerRef.current!.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(
          containerRef.current!.clientWidth,
          containerRef.current!.clientHeight
        );
      };

      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("click", onClick);
        window.removeEventListener("touchend", onClick);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
      };
    };

    init();
  }, []);

  return (
    <div className="relative w-full h-full bg-transparent overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}