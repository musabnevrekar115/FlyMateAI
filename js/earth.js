
import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";

const container = document.getElementById("earth-container");
const hero = document.querySelector(".hero");

if (container && hero) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45, 1, 0.1, 1000
  );
  camera.position.z = 3.4;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
  );

  container.appendChild(renderer.domElement);

  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  const geometry = new THREE.SphereGeometry(
    1.28, 72, 72
  );

  const textureLoader = new THREE.TextureLoader();

  const earthTexture = textureLoader.load(
    "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
  );

  earthTexture.colorSpace = THREE.SRGBColorSpace;

  const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture,
    shininess: 8,
    specular: new THREE.Color("#3d6c9f")
  });

  const globe = new THREE.Mesh(geometry, earthMaterial);
  globeGroup.add(globe);

  // Atmosphere glow shell
  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.32, 72, 72),
    new THREE.MeshBasicMaterial({
      color: "#258aff",
      transparent: true,
      opacity: 0.075,
      side: THREE.BackSide,
      depthWrite: false
    })
  );
  globeGroup.add(atmosphere);

  // Soft cinematic lighting
  scene.add(new THREE.AmbientLight("#78a4d4", 0.65));

  const sunlight = new THREE.DirectionalLight(
    "#d8edff", 2.0
  );
  sunlight.position.set(-3, 3, 5);
  scene.add(sunlight);

  const rimLight = new THREE.DirectionalLight(
    "#1b73ff", 2.2
  );
  rimLight.position.set(3, 0, -4);
  scene.add(rimLight);

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  function moveEarth(event) {
    if (reducedMotion.matches) return;

    const rect = hero.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) / rect.width - 0.5;

    const y =
      (event.clientY - rect.top) / rect.height - 0.5;

    targetY = x * 1.1;
    targetX = y * 0.45;
  }

  hero.addEventListener("pointermove", moveEarth);

  hero.addEventListener("pointerleave", () => {
    targetX = 0;
    targetY = 0;
  });

  function resize() {
    const size = container.clientWidth;

    renderer.setSize(size, size, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", resize);
  resize();

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);

    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;

    globeGroup.rotation.x = currentX;
    globeGroup.rotation.y = currentY;

    if (!reducedMotion.matches) {
      globe.rotation.y += delta * 0.035;
    }

    renderer.render(scene, camera);
  }

  animate();

  console.log("AeroEase 3D Earth initialized!");
}
