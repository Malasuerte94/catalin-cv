<template>
  <div ref="container" class="fixed inset-0 z-[-1] pointer-events-none overflow-hidden"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useDataStore } from '../stores/data';

const container = ref<HTMLElement | null>(null);
const dataStore = useDataStore();

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let model: THREE.Group | null = null;
let shadowPlane: THREE.Mesh;
let animationFrameId: number;

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

const init = () => {
  if (!container.value) return;

  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 10;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
  container.value.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const spotLight = new THREE.SpotLight(0x87efff, 2500);
  spotLight.position.set(-15, 15, 15);
  spotLight.angle = Math.PI / 6;
  spotLight.penumbra = 0.4;
  spotLight.decay = 2;
  spotLight.distance = 150;
  spotLight.castShadow = true;
  scene.add(spotLight);
  
  const lightTarget = new THREE.Object3D();
  scene.add(lightTarget);
  spotLight.target = lightTarget;

  const planeGeometry = new THREE.PlaneGeometry(100, 100);
  const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x0e0e11, shininess: 0 });
  shadowPlane = new THREE.Mesh(planeGeometry, planeMaterial);
  shadowPlane.position.z = -5;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  const loader = new GLTFLoader();
  loader.load(
    '/assets/keyboard.glb',
    (gltf) => {
      model = gltf.scene;
      
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.traverse((node) => {
        if ((node as THREE.Mesh).isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      // Center geometry internally
      model.position.sub(center);
      
      const wrapper = new THREE.Group();
      wrapper.add(model);
      scene.add(wrapper);
      model = wrapper;
    },
    undefined,
    (error) => {
      console.warn('Keyboard model not found, using fallback object');
      const geometry = new THREE.BoxGeometry(5, 1, 3);
      const material = new THREE.MeshPhongMaterial({ color: 0x87efff, wireframe: false });
      const fallback = new THREE.Mesh(geometry, material);
      fallback.castShadow = true;
      model = new THREE.Group();
      model.add(fallback);
      scene.add(model);
    }
  );

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);

    if (model) {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.max(0, Math.min(100, (scrollY / (maxScroll || 1)) * 100));

      const keyframes = dataStore.backgroundKeyframes;
      
      if (keyframes.length > 0) {
        // Find current segment
        let startIdx = 0;
        for (let i = 0; i < keyframes.length; i++) {
          if (keyframes[i].scrollPercent <= scrollPercent) {
            startIdx = i;
          } else {
            break;
          }
        }
        
        let endIdx = Math.min(startIdx + 1, keyframes.length - 1);
        const startK = keyframes[startIdx];
        const endK = keyframes[endIdx];
        
        let t = 0;
        if (startIdx !== endIdx) {
          const range = endK.scrollPercent - startK.scrollPercent;
          t = (scrollPercent - startK.scrollPercent) / (range || 1);
        }

        // Interpolate
        model.position.x = lerp(parseFloat(startK.posX), parseFloat(endK.posX), t);
        model.position.y = lerp(parseFloat(startK.posY), parseFloat(endK.posY), t);
        model.position.z = lerp(parseFloat(startK.posZ), parseFloat(endK.posZ), t);
        
        model.rotation.x = lerp(parseFloat(startK.rotX), parseFloat(endK.rotX), t);
        model.rotation.y = lerp(parseFloat(startK.rotY), parseFloat(endK.rotY), t);
        model.rotation.z = lerp(parseFloat(startK.rotZ), parseFloat(endK.rotZ), t);
        
        const s = lerp(parseFloat(startK.scale), parseFloat(endK.scale), t);
        model.scale.set(s, s, s);
      } else {
        // Default behavior if no keyframes
        model.rotation.y += 0.002;
        model.position.x = Math.sin(scrollY * 0.0005) * 3;
        model.position.y = - (scrollY * 0.01) % 10 + 2; 
      }
      
      // Continuous Idle Floating (Up and Down)
      const idleOffset = Math.sin(Date.now() * 0.001) * 0.2;
      model.position.y += idleOffset;
      
      lightTarget.position.copy(model.position);
    }

    renderer.render(scene, camera);
  };

  animate();
  window.addEventListener('resize', onWindowResize);
};

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

onMounted(async () => {
  if (dataStore.backgroundKeyframes.length === 0) {
    await dataStore.fetchAll();
  }
  init();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', onWindowResize);
  if (renderer) renderer.dispose();
});
</script>
