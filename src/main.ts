import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { drawLineBetweenTwoCities, updateData, turnLabelsTowardsCamera } from './util';
import { updateMissionStatus } from './console';
import { createLabels } from './text';

(async () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');
  
  const camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight);
  camera.position.set(0, 0, 5);
  camera.lookAt(scene.position);
  
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);
  
  window.addEventListener("resize", (event) => {
    console.log(event);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
  
  const cameraControls = new OrbitControls(camera, renderer.domElement);
  cameraControls.enableDamping = true;
  cameraControls.dampingFactor = 0.1;
  cameraControls.mouseButtons = { LEFT: THREE.MOUSE.PAN };
  document.addEventListener('keyup', (event) => event.shiftKey ? cameraControls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE } : null);
  document.addEventListener('keydown', (event) => event.shiftKey ? cameraControls.mouseButtons = { LEFT: THREE.MOUSE.PAN } : null);

  let minLongitude = -2, maxLongitude = 3, minLatitude = 48, maxLatitude = 52;
  let cities = `los_angeles,london`;
  
  let url = new URL(window.location.href);
  url.searchParams.set('lomin', minLongitude.toString());
  url.searchParams.set('lomax', maxLongitude.toString());
  url.searchParams.set('lamin', minLatitude.toString());
  url.searchParams.set('lamax', maxLatitude.toString());
  url.searchParams.set('cities', cities);
  
  let geometry = new THREE.SphereGeometry(1, 32, 32);
  let material = new THREE.MeshBasicMaterial({ color: 'green', transparent: true, opacity: 0.2, wireframe: true });
  let sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  const dotLabelGroup = await createLabels();
  scene.add(dotLabelGroup);
  
  renderer.setAnimationLoop(function (domTimestamp) {
    // group.rotation.y = t/3000;
  
    turnLabelsTowardsCamera(dotLabelGroup, cameraControls);
  
    if (domTimestamp % 2000 < 16) { // every 2 seconds
      updateMissionStatus();
  
      let url = new URL(window.location.href);
      minLongitude = parseFloat(url.searchParams.get('lomin') || `${minLongitude}`);
      maxLongitude = parseFloat(url.searchParams.get('lomax') || `${maxLongitude}`);
      minLatitude = parseFloat(url.searchParams.get('lamin') || `${minLatitude}`);
      maxLatitude = parseFloat(url.searchParams.get('lamax') || `${maxLatitude}`);
  
      cities = url.searchParams.get('cities') || cities;
      drawLineBetweenTwoCities(scene, cities.split(',')[0], cities.split(',')[1]);
    }
  
    cameraControls.update();
    renderer.render(scene, camera);
  });

  // const dots = await updateData();
  // for (let dot of dots || []) { scene.add(dot); }
})();


