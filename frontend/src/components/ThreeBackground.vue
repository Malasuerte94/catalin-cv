<template>
  <div ref="container" class="fixed inset-0 z-[-1] pointer-events-none overflow-hidden"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const container = ref<HTMLElement | null>(null);
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let model: THREE.Group | null = null;
let animationFrameId: number;

const init = () => {
  if (!container.value) return;

  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.value.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0x87efff, 2);
  directionalLight.position.set(-5, 5, 5);
  scene.add(directionalLight);

  const loader = new GLTFLoader();
  loader.load(
    '/assets/keyboard.glb',
    (gltf) => {
      model = gltf.scene;
      
      // Center and scale the model
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3 / maxDim;
      model.scale.set(scale, scale, scale);
      
      model.position.set(0, 0, 0);
      scene.add(model);
      console.log('Model loaded and centered', { scale, size });
    },
    undefined,
    (error) => {
      console.warn('Keyboard model not found, using fallback object');
      const geometry = new THREE.BoxGeometry(2, 0.5, 1);
      const material = new THREE.MeshPhongMaterial({ color: 0x87efff, wireframe: true });
      const fallback = new THREE.Mesh(geometry, material);
      model = new THREE.Group();
      model.add(fallback);
      scene.add(model);
    }
  );

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);

    if (model) {
      // Base rotation
      model.rotation.y += 0.002;
      
      // Scroll-based rotation & movement
      const scrollY = window.scrollY;
      model.rotation.x = scrollY * 0.002;
      model.rotation.z = scrollY * 0.001;
      
      model.position.x = Math.sin(scrollY * 0.001) * 2;
      model.position.y = Math.cos(scrollY * 0.001) * 1;
      
      // Floating effect
      model.position.y += Math.sin(Date.now() * 0.001) * 0.1;
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

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', onWindowResize);
  if (renderer) {
    renderer.dispose();
  }
});
</script>
