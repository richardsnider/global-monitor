import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader.js';

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

const controls = new OrbitControls(camera, renderer.domElement);
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

let minLongitude = -2, maxLongitude = 3, minLatitude = 48, maxLatitude = 52;
let cities = `los_angeles,london`;

let url = new URL(window.location.href);
url.searchParams.set('lomin', minLongitude.toString());
url.searchParams.set('lomax', maxLongitude.toString());
url.searchParams.set('lamin', minLatitude.toString());
url.searchParams.set('lamax', maxLatitude.toString());
url.searchParams.set('cities', cities);

let line: THREE.Line<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.LineDashedMaterial, THREE.Object3DEventMap>

let group = new THREE.Group();
scene.add(group);

const fontLoader = new FontLoader();
fontLoader.load('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json', createLabels);

function createLabels(font: Font) {
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

Object.assign(missionStatus.style, {
  position: 'absolute',
  backgroundColor: "black",
  opacity: '0.8',
  color: "green",
  border: "1px solid green",
  maxWidth: 500 + 'px',
  top: 20 + 'px',
  left: 20 + 'px',
});

missionDescription.style.font = "Courier New";

const updateMissionStatus = () => {
  let glitchText = '';
  for (let i = 0; i < 490; i++) {
    glitchText += String.fromCharCode(0x30A0 + Math.random() * (0x30FF - 0x30A0 + 1));
  }
  missionStatus.innerHTML = glitchText;
}

const updateData = () => {
  fetch(`https://opensky-network.org/api/states/all?lamin=${minLatitude}&lomin=${minLongitude}&lamax=${maxLatitude}&lomax=${maxLongitude}`)
    .then(response => {
      if (response.ok) return response.json();
      else console.error(`${response.url} HTTP-Error: ${response.status}`);
    })
    .then(data => {
      if (data?.states) {
        for (let state of data.states) {
          let longitude = state[5];
          let latitude = state[6];
          let vector = getVectorFromLongitudeLatitude(longitude, latitude);
          let dot = new THREE.Mesh(new THREE.SphereGeometry(0.001, 32, 32), new THREE.MeshBasicMaterial({ color: 'red' }));
          dot.position.copy(vector);
          group.add(dot);
        }
      }
    });
};

const turnLabelsTowardsCamera = () => {
  for (let label of group.children) {
    label.rotation.set(
      controls.getPolarAngle() - Math.PI / 2,
      controls.getAzimuthalAngle() - group.rotation.y,
      0,
      'YXZ'
    );
  }
};

const drawLineBetweenTwoCities = (city1: string, city2: string) => {
  let { longitude: longitude1, latitude: latitude1 } = longitudeLatitudeCoordinates[city1];
  let { longitude: longitude2, latitude: latitude2 } = longitudeLatitudeCoordinates[city2];
  let vector1 = getVectorFromLongitudeLatitude(longitude1, latitude1);
  let vector2 = getVectorFromLongitudeLatitude(longitude2, latitude2);
  let curve = new THREE.QuadraticBezierCurve3(
    vector1,
    vector1.clone().add(vector2).multiplyScalar(1),
    vector2
  );
  let points = curve.getPoints(50);

  let geometry = new THREE.BufferGeometry().setFromPoints(points);
  let material = new THREE.LineDashedMaterial({ color: 'yellow', dashSize: 0.01, gapSize: 0.01 });
  line = new THREE.Line(geometry, material);
  line.computeLineDistances();

  if (line) scene.remove(line);
  scene.add(line);
}

updateData();

renderer.setAnimationLoop(function (domTimestamp) {
  // group.rotation.y = t/3000;

  turnLabelsTowardsCamera();

  if (domTimestamp % 2000 < 16) { // every 2 seconds
    updateMissionStatus();

    let url = new URL(window.location.href);
    minLongitude = parseFloat(url.searchParams.get('lomin') || `${minLongitude}`);
    maxLongitude = parseFloat(url.searchParams.get('lomax') || `${maxLongitude}`);
    minLatitude = parseFloat(url.searchParams.get('lamin') || `${minLatitude}`);
    maxLatitude = parseFloat(url.searchParams.get('lamax') || `${maxLatitude}`);

    cities = url.searchParams.get('cities') || cities;
    drawLineBetweenTwoCities(cities.split(',')[0], cities.split(',')[1]);

  }

  controls.update();
  renderer.render(scene, camera);
});
