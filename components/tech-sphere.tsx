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
      mouse: any,
      particles: any[] = [];

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

      const aspect = containerRef.current!.clientWidth /
          containerRef.current!.clientHeight;
      
      // Ajustar FOV según el aspect ratio
      const fov = aspect > 1 ? 75 : 60;
      
      camera = new THREE.PerspectiveCamera(
        fov,
        aspect,
        0.1,
        1000
      );
      camera.position.z = aspect > 1 ? 7.5 : 6.5;


      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });

      renderer.setSize(
        containerRef.current!.clientWidth,
        containerRef.current!.clientHeight
      );
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      containerRef.current!.appendChild(renderer.domElement);

      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2(-999, -999);

      // Partículas de fondo
      const particleGeometry = new THREE.BufferGeometry();
      const particleCount = 100;
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 10;
        positions[i + 1] = (Math.random() - 0.5) * 10;
        positions[i + 2] = (Math.random() - 0.5) * 10;
      }

      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.05,
        transparent: true,
        opacity: 0.3,
      });

      const particleSystem = new THREE.Points(
        particleGeometry,
        particleMaterial
      );
      scene.add(particleSystem);
      particles.push(particleSystem);

      // Crear labels
      technologies.forEach((tech, index) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = 512;
        canvas.height = 128;

        ctx.font = "bold 48px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(tech, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);

        const material = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          opacity: 0.95,
        });

        const sprite = new THREE.Sprite(material);

        // distribución esfera
        const phi = Math.acos(-1 + (2 * index) / technologies.length);
        const theta = Math.sqrt(technologies.length * Math.PI) * phi;

        const isMobile = window.innerWidth < 768;
        const radius = isMobile ? 2.1 : 2.8;


        sprite.position.set(
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(phi)
        );

        const baseScale = isMobile ? 1.4 : 1.8;
        sprite.scale.set(baseScale, baseScale * 0.25, 1);


        // Guardar datos originales
        sprite.userData = {
          originalScale: sprite.scale.clone(),
          originalPosition: sprite.position.clone(),
          targetScale: sprite.scale.clone(),
          techName: tech,
          floatOffset: Math.random() * Math.PI * 2,
        };

        scene.add(sprite);
        labels.push(sprite);
      });

      setIsLoaded(true);

      const onPointerMove = (e: PointerEvent) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

        const rect = containerRef.current!.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      };

      const onClick = () => {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(labels);

        if (intersects.length > 0) {
          const clicked = intersects[0].object;
          selectedLabel = selectedLabel === clicked ? null : clicked;
        } else {
          selectedLabel = null;
        }
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("click", onClick);

      const animate = () => {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        const rotX = mouseY * 0.3;
        const rotY = mouseX * 0.3;

        scene.rotation.x += (rotX - scene.rotation.x) * 0.05;
        scene.rotation.y += (rotY - scene.rotation.y) * 0.05;

        // auto rotación
        const isMobile = window.innerWidth < 768;
        scene.rotation.y += isMobile ? 0.006 : 0.002;

        scene.rotation.x = Math.max(-0.6, Math.min(0.6, scene.rotation.x));

        // Animar partículas
        particles.forEach((p) => {
          p.rotation.y += 0.001;
        });

        // Raycaster para hover
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(labels);

        labels.forEach((label) => {
          const isIntersected = intersects.some((i) => i.object === label);
          const isSelected = label === selectedLabel;

          // Efecto de flotación
          const floatY =
            Math.sin(time * 2 + label.userData.floatOffset) * 0.05;
          
          // Posición objetivo
          let targetPosition = label.userData.originalPosition.clone();
          targetPosition.y += floatY;

          // Zoom según interacción
          if (isSelected) {
            // Mover al centro cuando está seleccionado
            targetPosition.set(0, 0, 0);
            label.userData.targetScale = label.userData.originalScale
              .clone()
              .multiplyScalar(1.8);
            label.material.opacity = 1;
          } else if (isIntersected) {
            // Acercar al centro en hover
            const directionToCenter = new THREE.Vector3(0, 0, 0)
              .sub(label.position)
              .multiplyScalar(0.3);
            targetPosition.add(directionToCenter);
            
            label.userData.targetScale = label.userData.originalScale
              .clone()
              .multiplyScalar(1.35);
            label.material.opacity = 1;
            if (containerRef.current) {
              containerRef.current.style.cursor = "pointer";
            }
          } else {
            label.userData.targetScale =
              label.userData.originalScale.clone();
            label.material.opacity = 0.95;
          }

          // Animación suave de posición
          label.position.lerp(targetPosition, 0.1);

          // Animación suave de escala con efecto elástico
          label.scale.lerp(label.userData.targetScale, 0.15);

          // Pulso de opacidad en hover
          if (isIntersected || isSelected) {
            const pulse = Math.sin(time * 3) * 0.05 + 0.95;
            label.material.opacity = pulse;
          }

          label.lookAt(camera.position);
        });

        if (intersects.length === 0 && containerRef.current) {
          containerRef.current.style.cursor = "default";
        }

        renderer.render(scene, camera);
      };

      animate();

      const onResize = () => {
        const w = containerRef.current!.clientWidth;
        const h = containerRef.current!.clientHeight;
        const aspect = w / h;
        
        camera.aspect = aspect;
        
        // Ajustar FOV y posición al redimensionar
        camera.fov = aspect > 1 ? 75 : 60;
        camera.position.z = aspect > 1 ? 7.5 : 6.5;

        
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("click", onClick);
        window.removeEventListener("resize", onResize);
        if (containerRef.current && renderer.domElement.parentNode) {
          containerRef.current.removeChild(renderer.domElement);
        }
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
                className="w-3 h-3 bg-primary-foreground rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}