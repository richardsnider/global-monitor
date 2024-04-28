import * as THREE from "three";
import { TextGeometry, TextGeometryParameters } from 'three/examples/jsm/geometries/TextGeometry.js';
import { Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { coordinates } from './data';
import { getVectorFromLongitudeLatitude } from './util';

const createLabels = async () => {
  // generate typeface.json files from ttf with https://github.com/gero3/facetype.js
  const jsonData = require('./pixel-coleco-font.json');
  const font = new Font(jsonData);

  let material = new THREE.MeshBasicMaterial({ color: 'white' });
  let options: TextGeometryParameters = {
    font: font,
    size: 0.03,
    height: 0,
  };

  const dotLabelGroup = new THREE.Group();
  for (let city in coordinates) {
    let { longitude, latitude } = coordinates[city];
    let vector = getVectorFromLongitudeLatitude(longitude, latitude);
    let label = new THREE.Mesh(new TextGeometry(city, options), material);
    let dot = new THREE.Mesh(new THREE.SphereGeometry(0.01, 32, 32), new THREE.MeshBasicMaterial({ color: 'yellow' }));
    label.position.copy(vector).multiplyScalar(1.05);
    dot.position.copy(vector);
    dotLabelGroup.add(dot);
    dotLabelGroup.add(label);
  }

  return dotLabelGroup;
}

export { createLabels };