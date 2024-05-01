import * as THREE from "three";

import { initScene, scene } from './scene';
import { createGui } from './gui';

(async () => {
  initScene();
  createGui();

  // let minLongitude = -2, maxLongitude = 3, minLatitude = 48, maxLatitude = 52;
  // let cities = `los_angeles,london`;

  // let url = new URL(window.location.href);
  // url.searchParams.set('lomin', minLongitude.toString());
  // url.searchParams.set('lomax', maxLongitude.toString());
  // url.searchParams.set('lamin', minLatitude.toString());
  // url.searchParams.set('lamax', maxLatitude.toString());
  // url.searchParams.set('cities', cities);

  let geometry = new THREE.SphereGeometry(1, 32, 32);
  let material = new THREE.MeshBasicMaterial({ color: 'green', transparent: true, opacity: 0.2, wireframe: true });
  let sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  // const dots = await updateData();
  // for (let dot of dots || []) { scene.add(dot); }
})();


