import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/controls/OrbitControls.js";

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#0f0e17");

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 15);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = true;

// Light
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(10, 15, 10);
scene.add(light);

// Floating cube group
const monastery = new THREE.Group();
scene.add(monastery);

// Add cubes (no randomness)
for (let x = -2; x <= 2; x++) {
  for (let y = 0; y <= 4; y++) {
    for (let z = -2; z <= 2; z++) {
      const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
      const cubeMat = new THREE.MeshStandardMaterial({
        color: `hsl(${180 + y * 15}, 70%, 65%)`,
        roughness: 0.4,
        metalness: 0.3,
      });
      const cube = new THREE.Mesh(cubeGeo, cubeMat);
      cube.position.set(x, y, z);
      monastery.add(cube);
    }
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  monastery.rotation.y += 0.002;
  monastery.position.y = Math.sin(Date.now() * 0.001) * 0.5;
  controls.update();
  renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
