import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, controls;
let temple = new THREE.Group();

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#0f0e17");

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 20, 50);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const light = new THREE.PointLight(0xffffff, 1.2);
  light.position.set(20, 40, 20);
  scene.add(light);

  buildTemple();
  scene.add(temple);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function buildTemple() {
  // Build base tiers from bottom to top
  buildTier(11, 4, -10, 0xffffff); // bottom base
  buildTier(9, 3, 0, 0xbb8866); // inner wood tier
  buildTier(7, 2, 10, 0xffcc88); // upper level
  buildTier(5, 1, 18, 0xffe066); // golden roof
  buildSpire(0, 24, 0xfffba0); // top spire
}

function buildTier(columns, rows, yOffset, colorHex) {
  const spacing = 3;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      for (let z = 0; z < columns; z++) {
        let px = (x - columns / 2) * spacing;
        let pz = (z - columns / 2) * spacing;
        let py = yOffset + y * spacing;
        let dot = createDot(px, py, pz, colorHex);
        temple.add(dot);
      }
    }
  }
}

function buildSpire(cx, yStart, colorHex) {
  for (let i = 0; i < 6; i++) {
    let dot = createDot(cx, yStart + i * 2.5, 0, colorHex, 0.7);
    temple.add(dot);
  }
}

function createDot(x, y, z, hexColor, scale = 1) {
  const geometry = new THREE.SphereGeometry(0.6 * scale, 12, 12);
  const material = new THREE.MeshStandardMaterial({
    color: hexColor,
    emissive: hexColor,
    emissiveIntensity: 0.5,
  });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(x, y, z);
  sphere.userData.offset = Math.random() * 1000;
  return sphere;
}

function animate() {
  requestAnimationFrame(animate);

  // Floating motion
  temple.children.forEach((dot, i) => {
    let offset = dot.userData.offset || 0;
    dot.position.y += Math.sin(Date.now() * 0.002 + offset) * 0.005;
  });

  controls.update();
  renderer.render(scene, camera);
}
