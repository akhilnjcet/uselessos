import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useOS } from '../context/OSContext';

export const Nature3DCanvas = () => {
  const mountRef = useRef(null);
  const { activeEffects, performanceMode } = useOS();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 50);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !performanceMode });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, performanceMode ? 1 : 2));
    container.appendChild(renderer.domElement);

    // Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Thunder Flash Light
    const thunderLight = new THREE.PointLight(0x00e5ff, 0, 500);
    thunderLight.position.set(0, 50, 20);
    scene.add(thunderLight);

    // -------------------------------------------------------------------------
    // A. 3D RAIN PARTICLES
    // -------------------------------------------------------------------------
    const rainCount = performanceMode ? 1500 : 4000;
    const rainGeo = new THREE.BufferGeometry();
    const rainPos = new Float32Array(rainCount * 3);
    const rainVels = new Float32Array(rainCount);

    for (let i = 0; i < rainCount; i++) {
      rainPos[i * 3] = (Math.random() - 0.5) * 200;
      rainPos[i * 3 + 1] = Math.random() * 150 - 50;
      rainPos[i * 3 + 2] = (Math.random() - 0.5) * 150;
      rainVels[i] = 1.5 + Math.random() * 2;
    }

    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
    const rainMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.8,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const rainParticles = new THREE.Points(rainGeo, rainMat);
    rainParticles.visible = false;
    scene.add(rainParticles);

    // -------------------------------------------------------------------------
    // B. 3D NIGHT STARFIELD & MOON
    // -------------------------------------------------------------------------
    const starCount = performanceMode ? 800 : 2000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 300;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 200;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.9,
      transparent: true,
      opacity: 0.9
    });
    const starParticles = new THREE.Points(starGeo, starMat);
    starParticles.visible = false;
    scene.add(starParticles);

    // 3D Glowing Moon Mesh
    const moonGeo = new THREE.SphereGeometry(6, 32, 32);
    const moonMat = new THREE.MeshBasicMaterial({
      color: 0xfffbeb,
      transparent: true,
      opacity: 0.9
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.position.set(40, 25, -20);
    moonMesh.visible = false;
    scene.add(moonMesh);

    // -------------------------------------------------------------------------
    // C. 3D EARTHQUAKE DUST DEBRIS
    // -------------------------------------------------------------------------
    const dustCount = 400;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 100;
      dustPos[i * 3 + 1] = Math.random() * 40 - 20;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xd97706,
      size: 1.2,
      transparent: true,
      opacity: 0.6
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    dustParticles.visible = false;
    scene.add(dustParticles);

    // -------------------------------------------------------------------------
    // D. 3D RAINBOW ARC
    // -------------------------------------------------------------------------
    const rainbowGeo = new THREE.TorusGeometry(35, 2.5, 16, 100, Math.PI);
    const rainbowMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const rainbowMesh = new THREE.Mesh(rainbowGeo, rainbowMat);
    rainbowMesh.position.set(0, -10, -30);
    rainbowMesh.visible = false;
    scene.add(rainbowMesh);

    // -------------------------------------------------------------------------
    // E. 3D DOG CROSSING MESH
    // -------------------------------------------------------------------------
    const dogGroup = new THREE.Group();
    const dogBodyGeo = new THREE.BoxGeometry(4, 2, 2);
    const dogMat = new THREE.MeshBasicMaterial({ color: 0xb45309 });
    const dogBody = new THREE.Mesh(dogBodyGeo, dogMat);

    const dogHeadGeo = new THREE.BoxGeometry(2, 2, 2);
    const dogHead = new THREE.Mesh(dogHeadGeo, dogMat);
    dogHead.position.set(2.2, 1, 0);

    dogGroup.add(dogBody);
    dogGroup.add(dogHead);
    dogGroup.position.set(-70, -22, 10);
    dogGroup.visible = false;
    scene.add(dogGroup);

    // -------------------------------------------------------------------------
    // F. 3D CROW FLYING MESH (Foreground)
    // -------------------------------------------------------------------------
    const crowGroup = new THREE.Group();
    const crowMat = new THREE.MeshBasicMaterial({ color: 0x334155 });
    const crowBody = new THREE.Mesh(new THREE.BoxGeometry(4, 1.8, 1.8), crowMat);
    const crowWingL = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.3, 4), crowMat);
    crowWingL.position.set(0, 0.5, 2.2);
    const crowWingR = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.3, 4), crowMat);
    crowWingR.position.set(0, 0.5, -2.2);

    // Beak
    const beakMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const beakMesh = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.8, 8), beakMat);
    beakMesh.rotation.z = -Math.PI / 2;
    beakMesh.position.set(2.4, 0, 0);

    crowGroup.add(crowBody);
    crowGroup.add(crowWingL);
    crowGroup.add(crowWingR);
    crowGroup.add(beakMesh);
    crowGroup.position.set(-60, 15, 35);
    crowGroup.visible = false;
    scene.add(crowGroup);

    // Dropped Coconut Item
    const itemGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const itemMat = new THREE.MeshBasicMaterial({ color: 0x78350f });
    const itemMesh = new THREE.Mesh(itemGeo, itemMat);
    itemMesh.visible = false;
    scene.add(itemMesh);

    // -------------------------------------------------------------------------
    // F2. 3D OVERHEAT EMBERS & HEAT WAVE PARTICLES
    // -------------------------------------------------------------------------
    const heatCount = 300;
    const heatGeo = new THREE.BufferGeometry();
    const heatPos = new Float32Array(heatCount * 3);
    for (let i = 0; i < heatCount; i++) {
      heatPos[i * 3] = (Math.random() - 0.5) * 120;
      heatPos[i * 3 + 1] = Math.random() * 80 - 40;
      heatPos[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    heatGeo.setAttribute('position', new THREE.BufferAttribute(heatPos, 3));
    const heatMat = new THREE.PointsMaterial({
      color: 0xef4444,
      size: 1.8,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const heatParticles = new THREE.Points(heatGeo, heatMat);
    heatParticles.visible = false;
    scene.add(heatParticles);

    // -------------------------------------------------------------------------
    // G. 3D KERALA TRAFFIC ROAD & VEHICLES
    // -------------------------------------------------------------------------
    const roadGroup = new THREE.Group();
    const roadMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 12),
      new THREE.MeshBasicMaterial({ color: 0x0f172a, side: THREE.DoubleSide })
    );
    roadMesh.rotation.x = Math.PI / 2.2;
    roadMesh.position.set(0, -28, 0);
    roadGroup.add(roadMesh);

    // KSRTC Bus (Red Box)
    const busMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 4, 4), new THREE.MeshBasicMaterial({ color: 0xd97706 }));
    busMesh.position.set(-50, -25, 2);

    // Auto Rickshaw (Yellow Box)
    const autoMesh = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 3), new THREE.MeshBasicMaterial({ color: 0xeab308 }));
    autoMesh.position.set(-20, -26, 4);

    roadGroup.add(busMesh);
    roadGroup.add(autoMesh);
    roadGroup.visible = false;
    scene.add(roadGroup);

    // -------------------------------------------------------------------------
    // ANIMATION LOOP
    // -------------------------------------------------------------------------
    let animId;
    let clock = new THREE.Clock();
    let dogX = -70;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // 1. Rain & Wind Update
      if (activeEffects.rain) {
        rainParticles.visible = true;
        const positions = rainGeo.attributes.position.array;
        const windShift = activeEffects.wind ? 1.2 : 0.1;

        for (let i = 0; i < rainCount; i++) {
          positions[i * 3 + 1] -= rainVels[i]; // Fall Y
          positions[i * 3] += windShift;       // Wind X

          if (positions[i * 3 + 1] < -60) {
            positions[i * 3 + 1] = 80;
            positions[i * 3] = (Math.random() - 0.5) * 200;
          }
          if (positions[i * 3] > 100) {
            positions[i * 3] = -100;
          }
        }
        rainGeo.attributes.position.needsUpdate = true;
      } else {
        rainParticles.visible = false;
      }

      // 2. Night Sky Update
      if (activeEffects.night) {
        starParticles.visible = true;
        moonMesh.visible = true;
        starParticles.rotation.y = time * 0.02;
      } else {
        starParticles.visible = false;
        moonMesh.visible = false;
      }

      // 3. Earthquake Camera Shake & Debris
      if (activeEffects.earthquake) {
        const stage = activeEffects.earthquakeLevel || 2;
        const intensity = stage * 0.4;
        camera.position.x = (Math.random() - 0.5) * intensity;
        camera.position.y = (Math.random() - 0.5) * intensity;

        dustParticles.visible = true;
        const dPos = dustGeo.attributes.position.array;
        for (let i = 0; i < dustCount; i++) {
          dPos[i * 3 + 1] += Math.sin(time * 5 + i) * 0.1;
        }
        dustGeo.attributes.position.needsUpdate = true;
      } else if (!activeEffects.overheat) {
        camera.position.set(0, 0, 50);
        camera.rotation.set(0, 0, 0);
        dustParticles.visible = false;
      }

      // 4. Overheat Visual Distortion & Embers
      if (activeEffects.overheat) {
        camera.position.x = Math.sin(time * 15) * 1.2;
        camera.position.y = Math.cos(time * 12) * 1.2;
        camera.rotation.z = Math.sin(time * 10) * 0.04;

        heatParticles.visible = true;
        const hPos = heatGeo.attributes.position.array;
        for (let i = 0; i < heatCount; i++) {
          hPos[i * 3 + 1] += 0.4; // Rise Y
          hPos[i * 3] += Math.sin(time * 5 + i) * 0.1; // Float X
          if (hPos[i * 3 + 1] > 40) {
            hPos[i * 3 + 1] = -40;
            hPos[i * 3] = (Math.random() - 0.5) * 120;
          }
        }
        heatGeo.attributes.position.needsUpdate = true;
      } else {
        heatParticles.visible = false;
      }

      // 5. 3D Dog Crossing Update
      if (activeEffects.dogCrossing) {
        dogGroup.visible = true;
        dogX += 0.25;
        if (dogX > 70) dogX = -70;
        dogGroup.position.x = dogX;
        dogGroup.position.y = -22 + Math.abs(Math.sin(time * 8)) * 0.8; // Walking bounce
      } else {
        dogGroup.visible = false;
        dogX = -70;
      }

      // 6. 3D Crow Flying Update
      if (activeEffects.crowEvent) {
        crowGroup.visible = true;
        crowGroup.position.x += 0.45;
        crowWingL.rotation.x = Math.sin(time * 15) * 0.6;
        crowWingR.rotation.x = -Math.sin(time * 15) * 0.6;

        if (crowGroup.position.x > -10 && !itemMesh.visible) {
          itemMesh.visible = true;
          itemMesh.position.set(crowGroup.position.x, crowGroup.position.y - 2, crowGroup.position.z);
        }

        if (itemMesh.visible) {
          itemMesh.position.y -= 0.5; // Drop item
          itemMesh.rotation.x += 0.1;
          itemMesh.rotation.y += 0.1;
          if (itemMesh.position.y < -20) itemMesh.position.y = -20;
        }

        if (crowGroup.position.x > 70) {
          crowGroup.position.x = -70;
          itemMesh.visible = false;
        }
      } else {
        crowGroup.visible = false;
        itemMesh.visible = false;
        crowGroup.position.x = -70;
      }

      // 7. 3D Traffic Update
      if (activeEffects.keralaTraffic) {
        roadGroup.visible = true;
        busMesh.position.x += 0.3;
        if (busMesh.position.x > 70) busMesh.position.x = -70;

        autoMesh.position.x += 0.45;
        if (autoMesh.position.x > 70) autoMesh.position.x = -70;
      } else {
        roadGroup.visible = false;
      }

      // 8. Thunder Flash & Rainbow
      if (activeEffects.thunder && Math.random() < 0.03) {
        thunderLight.intensity = 15;
        setTimeout(() => { thunderLight.intensity = 0; }, 120);
      }
      rainbowMesh.visible = !!activeEffects.rainbow;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeEffects, performanceMode]);

  return (
    <div
      ref={mountRef}
      className={`fixed inset-0 pointer-events-none transition-opacity duration-700 ${
        activeEffects.cinematicMode ? 'z-[9995]' : 'z-[5]'
      }`}
    />
  );
};
