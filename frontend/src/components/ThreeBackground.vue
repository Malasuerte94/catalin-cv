<template>
  <div ref="container" class="fixed inset-0 z-[-1] pointer-events-none overflow-hidden"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { useDataStore } from '../stores/data';

const container = ref<HTMLElement | null>(null);
const dataStore = useDataStore();

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let composer: EffectComposer;
let model: THREE.Group | null = null;
let shadowPlane: THREE.Mesh;
let animationFrameId: number;

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;
const degToRad = (deg: number) => deg * (Math.PI / 180);

const init = () => {
  if (!container.value) return;

  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Moodier Tone Mapping
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.8; 
  
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;  
  container.value.appendChild(renderer.domElement);

  // Standard Post-processing
  composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // Subtle Ambient Light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambientLight);

  // Primary Key Light - Strong Blue (Top Left)
  const keyLight = new THREE.SpotLight(0x00e7fd, 400);
  keyLight.position.set(-10, 10, 15);
  keyLight.angle = Math.PI / 4;
  keyLight.penumbra = 0.6;
  keyLight.decay = 1.5;
  keyLight.distance = 50;
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.bias = -0.0005;
  keyLight.shadow.radius = 10;
  scene.add(keyLight);
  
  // Secondary Accent Light - Soft Green (Top Right)
  const greenLight = new THREE.SpotLight(0xffd966, 1000);
  greenLight.position.set(10, 10, 15);
  greenLight.angle = Math.PI / 4;
  greenLight.penumbra = 0.8;
  greenLight.decay = 2;
  greenLight.distance = 100;
  scene.add(greenLight);

  // Rim Light (Cyan)
  const rimLight = new THREE.PointLight(0x87efff, 80);
  rimLight.position.set(0, 5, -8);
  scene.add(rimLight);
  
  const lightTarget = new THREE.Object3D();
  scene.add(lightTarget);
  keyLight.target = lightTarget;
  greenLight.target = lightTarget;

  // Background Plane - Using design color #0e0e11
  const planeGeometry = new THREE.PlaneGeometry(200, 200);
  const planeMaterial = new THREE.MeshPhysicalMaterial({ 
    color: 0x0e0e11,
    roughness: 0.8,
    metalness: 0.0,
    reflectivity: 0.5
  });
  shadowPlane = new THREE.Mesh(planeGeometry, planeMaterial);
  shadowPlane.position.z = -2;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  const loader = new GLTFLoader();
  
  const loadModel = () => {
    loader.load(
      '/assets/keyboard.glb',
      (gltf) => {
        model = gltf.scene;
        
        model.traverse((node) => {
          if ((node as THREE.Mesh).isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
            const mesh = node as THREE.Mesh;
            if (mesh.material instanceof THREE.MeshStandardMaterial) {
              mesh.material.envMapIntensity = 0.8;
              mesh.material.roughness = Math.max(mesh.material.roughness, 0.3);
            }
          }
        });
        
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        const wrapper = new THREE.Group();
        wrapper.add(model);
        scene.add(wrapper);
        model = wrapper;
        
        // Entrance Animation
        model.scale.set(0, 0, 0);
        let entranceProgress = 0;
        const animateEntrance = () => {
          if (entranceProgress < 1) {
            entranceProgress += 0.02;
            const s = Math.sin((entranceProgress * Math.PI) / 2); // Ease out
            if (model) model.scale.set(s, s, s);
            requestAnimationFrame(animateEntrance);
          }
        };
        animateEntrance();
      },
      undefined,
      (error) => {
        console.warn('Keyboard model not found, using fallback object');
        const geometry = new THREE.BoxGeometry(5, 1, 3);
        const material = new THREE.MeshPhysicalMaterial({ 
          color: 0x87efff, 
          roughness: 0.2, 
          metalness: 0.9
        });
        const fallback = new THREE.Mesh(geometry, material);
        fallback.castShadow = true;
        model = new THREE.Group();
        model.add(fallback);
        scene.add(model);
      }
    );
  };

  if (document.readyState === 'complete') {
    loadModel();
  } else {
    window.addEventListener('load', loadModel, { once: true });
  }

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);

    if (model) {
      const scrollY = window.scrollY;
      const clientHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      const maxScroll = scrollHeight - clientHeight;
      const currentScroll = Math.max(0, Math.min(scrollY, maxScroll));

      const rawKeyframes = dataStore.backgroundKeyframes;
      
      if (rawKeyframes.length > 0) {
        const keyframesWithPos = rawKeyframes.map(kf => {
          const el = document.getElementById(kf.sectionId);
          let pos = 0;
          if (el) {
            const rect = el.getBoundingClientRect();
            const absoluteTop = rect.top + scrollY;
            pos = kf.sectionId === 'home' ? 0 : Math.max(0, absoluteTop - clientHeight / 2);
          }
          return { ...kf, absolutePos: pos };
        }).sort((a, b) => a.absolutePos - b.absolutePos);

        let startIdx = 0;
        for (let i = 0; i < keyframesWithPos.length; i++) {
          if (keyframesWithPos[i].absolutePos <= currentScroll) {
            startIdx = i;
          } else {
            break;
          }
        }
        
        let endIdx = Math.min(startIdx + 1, keyframesWithPos.length - 1);
        const startK = keyframesWithPos[startIdx];
        const endK = keyframesWithPos[endIdx];
        
        let t = 0;
        if (startIdx !== endIdx) {
          const range = endK.absolutePos - startK.absolutePos;
          t = (currentScroll - startK.absolutePos) / (range || 1);
          t = Math.max(0, Math.min(1, t));
        }

        model.position.x = lerp(parseFloat(startK.posX), parseFloat(endK.posX), t);
        model.position.y = lerp(parseFloat(startK.posY), parseFloat(endK.posY), t);
        model.position.z = lerp(parseFloat(startK.posZ), parseFloat(endK.posZ), t);
        
        model.rotation.x = degToRad(lerp(parseFloat(startK.rotX), parseFloat(endK.rotX), t));
        model.rotation.y = degToRad(lerp(parseFloat(startK.rotY), parseFloat(endK.rotY), t));
        model.rotation.z = degToRad(lerp(parseFloat(startK.rotZ), parseFloat(endK.rotZ), t));
        
        const s = lerp(parseFloat(startK.scale), parseFloat(endK.scale), t);
        model.scale.set(s, s, s);
      } else {
        model.rotation.y += 0.002;
        model.position.x = Math.sin(scrollY * 0.0005) * 3;
        model.position.y = - (scrollY * 0.01) % 10 + 2; 
      }
      
      const idleOffset = Math.sin(Date.now() * 0.001) * 0.1;
      model.position.y += idleOffset;
      lightTarget.position.copy(model.position);
    }

    composer.render();
  };

  animate();
  window.addEventListener('resize', onWindowResize);
};

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
};

onMounted(async () => {
  if (dataStore.backgroundKeyframes.length === 0) {
    await dataStore.fetchAll();
  }
  init();
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', onWindowResize);
  if (renderer) renderer.dispose();
});
</script>
