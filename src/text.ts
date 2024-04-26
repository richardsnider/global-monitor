import * as THREE from "three";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { coordinates } from './data';
import { getVectorFromLongitudeLatitude } from './util';

const createLabels = async () => {
  const fontLoader = new FontLoader();
  // fontLoader.load('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json', createLabels);
  const font = await fontLoader.loadAsync('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json');

  let material = new THREE.MeshBasicMaterial({ color: 'white' });
  let options = {
    font: font,
    size: 0.02,
    height: 0.01,
  };

  const dotLabels = new THREE.Group();
  for (let city in coordinates) {
    let { longitude, latitude } = coordinates[city];
    let vector = getVectorFromLongitudeLatitude(longitude, latitude);
    let label = new THREE.Mesh(new TextGeometry(city, options), material);
    let dot = new THREE.Mesh(new THREE.SphereGeometry(0.01, 32, 32), new THREE.MeshBasicMaterial({ color: 'yellow' }));
    label.position.copy(vector).multiplyScalar(1.05);
    dot.position.copy(vector);
    dotLabels.add(label);
    dotLabels.add(dot);
  }

  return dotLabels;
}

export { createLabels };