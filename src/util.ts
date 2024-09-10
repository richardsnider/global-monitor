import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { coordinates } from './data';

const getVectorFromLongitudeLatitude = (longitude: number, latitude: number) => {
  const phi = (90 - latitude) * Math.PI / 180;
  const theta = (longitude + 180) * Math.PI / 180;

  return new THREE.Vector3(
    Math.sin(phi) * Math.cos(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta)
  ).multiply(new THREE.Vector3(1, 1, -1));
}

const drawLineBetweenTwoCities = (scene: THREE.Scene , city1: string, city2: string) => {
  const { longitude: longitude1, latitude: latitude1 } = coordinates[city1];
  const { longitude: longitude2, latitude: latitude2 } = coordinates[city2];
  const vector1 = getVectorFromLongitudeLatitude(longitude1, latitude1);
  const vector2 = getVectorFromLongitudeLatitude(longitude2, latitude2);
  const curve = new THREE.QuadraticBezierCurve3(
    vector1,
    vector1.clone().add(vector2).multiplyScalar(1),
    vector2
  );

  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineDashedMaterial({ color: 'yellow', dashSize: 0.01, gapSize: 0.01 });
  const line = new THREE.Line(geometry, material);
  line.computeLineDistances();

  if (line) scene.remove(line);
  scene.add(line);
}

const updateData = async () => {
  const response = await fetch(`https://opensky-network.org/api/states/all?lamin=${minLatitude}&lomin=${minLongitude}&lamax=${maxLatitude}&lomax=${maxLongitude}`)
  if (!response.ok) console.error(`${response.url} HTTP-Error: ${response.status}`);

  const data = await response.json();
  const dots: THREE.Mesh[] = [];
  if (data?.states) {
    for (let state of data.states) {
      let longitude = state[5];
      let latitude = state[6];
      let vector = getVectorFromLongitudeLatitude(longitude, latitude);
      let dot = new THREE.Mesh(new THREE.SphereGeometry(0.001, 32, 32), new THREE.MeshBasicMaterial({ color: 'red' }));
      dot.position.copy(vector);
      dots.push(dot);
    }

    return dots;
  }
};

const turnTowardsCamera = (group : THREE.Group, controls : OrbitControls) => {
  for (let object of group.children) {
    object.rotation.set(
      controls.getPolarAngle() - Math.PI / 2,
      controls.getAzimuthalAngle() - group.rotation.y,
      0,
      'YXZ'
    );
  }
};

const queryGroupObjects = (group : THREE.Group, predicate : (object : THREE.Object3D) => boolean) => {
  let objects: THREE.Object3D[] = [];
  for (let object of group.children) {
    if (predicate(object)) objects.push(object);
  }

  return objects;
}

export { getVectorFromLongitudeLatitude, drawLineBetweenTwoCities, turnTowardsCamera, updateData };