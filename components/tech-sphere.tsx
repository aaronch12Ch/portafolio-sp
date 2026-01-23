"use client";



import { useEffect, useRef, useState } from 'react';

export default function TechSphere() {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let scene, camera, renderer, sphere, labels = [];
    let mouseX = 0, mouseY = 0;
    let targetRotationX = 0, targetRotationY = 0;

    const technologies = [
      '.NET Framework',
      'SQL Server',
      'Spring Boot',
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'PostgreSQL',
      'Docker',
      'AWS',
      'Git',
      'Tailwind CSS'
    ];

    const init = async () => {
      const THREE = await import('three');
      
      // Scene
      scene = new THREE.Scene();

      // Camera
      camera = new THREE.PerspectiveCamera(
        75,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      // Renderer
      renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
      });
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      containerRef.current.appendChild(renderer.domElement);

      // Esfera wireframe
      const geometry = new THREE.SphereGeometry(2, 32, 32);
      const material = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });
      sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      // Crear etiquetas de texto como sprites
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 512;
      canvas.height = 128;

      technologies.forEach((tech, index) => {
        // Limpiar canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Configurar texto
        context.font = 'Bold 48px Arial';
        context.fillStyle = '#ffffff';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(tech, canvas.width / 2, canvas.height / 2);

        // Crear textura del texto
        const texture = new THREE.CanvasTexture(canvas.cloneNode(true));
        
        // Crear sprite
        const spriteMaterial = new THREE.SpriteMaterial({ 
          map: texture,
          transparent: true,
          opacity: 0.9
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        
        // Posicionar en esfera (distribución fibonacci)
        const phi = Math.acos(-1 + (2 * index) / technologies.length);
        const theta = Math.sqrt(technologies.length * Math.PI) * phi;
        
        const radius = 2.5;
        sprite.position.x = radius * Math.cos(theta) * Math.sin(phi);
        sprite.position.y = radius * Math.sin(theta) * Math.sin(phi);
        sprite.position.z = radius * Math.cos(phi);
        
        sprite.scale.set(2, 0.5, 1);
        
        scene.add(sprite);
        labels.push(sprite);
      });

      setIsLoaded(true);

      // Mouse move
      const onMouseMove = (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener('mousemove', onMouseMove);

      // Touch move
      const onTouchMove = (event) => {
        if (event.touches.length > 0) {
          mouseX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
          mouseY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
        }
      };
      window.addEventListener('touchmove', onTouchMove);

      // Resize
      const onResize = () => {
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      };
      window.addEventListener('resize', onResize);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        // Rotación suave basada en mouse
        targetRotationX = mouseY * 0.5;
        targetRotationY = mouseX * 0.5;

        sphere.rotation.x += (targetRotationX - sphere.rotation.x) * 0.05;
        sphere.rotation.y += (targetRotationY - sphere.rotation.y) * 0.05;

        // Rotar labels con la escena
        labels.forEach((label, index) => {
          label.material.rotation += 0.001;
          
          // Hacer que las labels miren a la cámara
          label.lookAt(camera.position);
          
          // Animación de flotación sutil
          const time = Date.now() * 0.001;
          label.position.y += Math.sin(time + index) * 0.001;
        });

        // Auto-rotación cuando no hay interacción
        sphere.rotation.y += 0.002;

        renderer.render(scene, camera);
      };

      animate();

      // Cleanup
      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('resize', onResize);
        if (containerRef.current && renderer.domElement) {
          containerRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    };

    init();

    return () => {
      // Cleanup se maneja en la función init
    };
  }, []);

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-b from-background to-primary/5 rounded-2xl overflow-hidden">
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
      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center px-4">
        <p className="text-sm text-muted-foreground">
          Mueve el mouse para interactuar
        </p>
      </div>
    </div>
  );
}