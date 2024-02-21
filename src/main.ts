import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

var scene = new THREE.Scene();
scene.background = new THREE.Color('black');

var camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight);
camera.position.set(0, 0, 5);
camera.lookAt(scene.position);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", (event) => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const longitudeLatitudeCoordinates = {
  "los_angeles": { longitude: -118.2437, latitude: 34.0522 },
  "new_york": { longitude: -74.0060, latitude: 40.7128 },
  "london": { longitude: -0.1276, latitude: 51.5074 },
  "paris": { longitude: 2.3522, latitude: 48.8566 },
  "tokyo": { longitude: 139.6917, latitude: 35.6895 },
  "sydney": { longitude: 151.2093, latitude: -33.8688 },
  "moscow": { longitude: 37.6173, latitude: 55.7558 },
  "beijing": { longitude: 116.4074, latitude: 39.9042 },
  "delhi": { longitude: 77.1025, latitude: 28.7041 },
  "buenos_aires": { longitude: -58.3816, latitude: -34.6037 },
  "rio_de_janeiro": { longitude: -43.1729, latitude: -22.9068 },
  "cape_town": { longitude: 18.4241, latitude: -33.9249 },
  "cairo": { longitude: 31.2357, latitude: 30.0444 },
  "salt_lake_city": { longitude: -111.8910, latitude: 40.7608 },
  "anchorage": { longitude: -149.9003, latitude: 61.2181 },
  "honolulu": { longitude: -157.8583, latitude: 21.3069 },
  "istanbul": { longitude: 28.9784, latitude: 41.0082 },
  "miami": { longitude: -80.1918, latitude: 25.7617 },
  "abuja": { longitude: 7.4951, latitude: 9.0765 },
  "singapore": { longitude: 103.8198, latitude: 1.3521 },
  "seattle": { longitude: -122.3321, latitude: 47.6062 },
  "tapei": { longitude: 121.5654, latitude: 25.0330 },
  "bridgetown": { longitude: -59.5432, latitude: 13.1132 },
  "bogota": { longitude: -74.0721, latitude: 4.7110 },
  "mexico_city": { longitude: -99.1332, latitude: 19.4326 },
  "bora_bora": { longitude: -151.7500, latitude: -16.5004 },
  "bermuda": { longitude: -64.7505, latitude: 32.3078 },
  "fiji": { longitude: 178.0650, latitude: -17.7134 },
  "toronto": { longitude: -79.3832, latitude: 43.6532 },
}

var group = new THREE.Group();
scene.add(group);

new FontLoader().load('https://unpkg.com/three@0.154.0/examples/fonts/helvetiker_regular.typeface.json', createLabels);

function createLabels(font) {
  let material = new THREE.MeshBasicMaterial({ color: 'white' });
  let options = {
    font: font,
    size: 0.02,
    height: 0.01,
  };

  for (let city in longitudeLatitudeCoordinates) {
    let { longitude, latitude } = longitudeLatitudeCoordinates[city];
    let vector = getVectorFromLongitudeLatitude(longitude, latitude);
    let label = new THREE.Mesh(new TextGeometry(city, options), material);
    let dot = new THREE.Mesh(new THREE.SphereGeometry(0.01, 32, 32), new THREE.MeshBasicMaterial({ color: 'yellow' }));
    label.position.copy(vector).multiplyScalar(1.05);
    dot.position.copy(vector);
    group.add(label);
    group.add(dot);
  }
}

let geometry = new THREE.SphereGeometry(1, 32, 32);
let material = new THREE.MeshBasicMaterial({ color: 'green', transparent: true, opacity: 0.2, wireframe: true });
let sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const getVectorFromLongitudeLatitude = (longitude, latitude) => {
  const phi = (90 - latitude) * Math.PI / 180;
  const theta = (longitude + 180) * Math.PI / 180;

  return new THREE.Vector3(
    Math.sin(phi) * Math.cos(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta)
  ).multiply(new THREE.Vector3(1, 1, -1));
}

let missionStatus = document.createElement('div');
let missionDescription = document.createElement('p');
missionStatus.appendChild(missionDescription);
document.body.appendChild(missionStatus);

missionStatus.style.position = 'absolute';
missionStatus.style.backgroundColor = "black";
missionStatus.style.opacity = '0.8';
missionStatus.style.color = "green";
missionStatus.style.border = "1px solid green";
missionStatus.style.maxWidth = 500 + 'px';
missionStatus.style.top = 20 + 'px';
missionStatus.style.left = 20 + 'px';

missionDescription.style.font = "Courier New";

renderer.setAnimationLoop(function (domTimestamp) {
  // group.rotation.y = t/3000;

  // turn the labels towards the camera
  for (var label of group.children) {
    label.rotation.set(
      controls.getPolarAngle() - Math.PI / 2,
      controls.getAzimuthalAngle() - group.rotation.y,
      0,
      'YXZ'
    );
  }

  if (domTimestamp % 2000 < 16) updateMissionStatus();

  controls.update();
  renderer.render(scene, camera);
});

const updateMissionStatus = () => {
  let glitchText = '';
  for (let i = 0; i < 490; i++) {
    glitchText += String.fromCharCode(0x30A0 + Math.random() * (0x30FF - 0x30A0 + 1));
  }
  missionStatus.innerHTML = glitchText;
}
