import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { getSetting } from './gui';
import { createLabels } from './text';
import { createVesselsGroup } from './vessels';
import { turnTowardsCamera, drawLineBetweenTwoCities, updateData } from './util';
import { updateMissionStatus } from './console';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let orbitControls: OrbitControls;
let renderer: THREE.WebGLRenderer;
let groups: Record<string, THREE.Group> = {};
let bloomPass: UnrealBloomPass;
let composer: EffectComposer;
let raycaster: THREE.Raycaster;
let pointer: THREE.Vector2;
let objects: THREE.Object3D[] = [];

const initScene = async () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color('black');

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);

  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight);
  camera.position.set(0, 0, 5);
  camera.lookAt(scene.position);

  orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;
  orbitControls.dampingFactor = 0.1;
  orbitControls.mouseButtons = { LEFT: THREE.MOUSE.PAN };
  document.addEventListener('keyup', (event) => event.shiftKey ? orbitControls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE } : null);
  document.addEventListener('keydown', (event) => event.shiftKey ? orbitControls.mouseButtons = { LEFT: THREE.MOUSE.PAN } : null);

  renderer.setAnimationLoop(animate);

  const renderScene = new RenderPass(scene, camera);
  bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
  const outputPass = new OutputPass();

  composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);
  composer.addPass(outputPass);

  window.addEventListener("resize", onWindowResize);
  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerdown', onPointerDown);

  const gridHelper = new THREE.GridHelper(10, 20);
  scene.add(gridHelper);

  groups['dotLabelGroup'] = await createLabels();
  groups['vesselsGroup'] = await createVesselsGroup();

  for (let key in groups) { scene.add(groups[key]); }
}

const onWindowResize: EventListener = (event) => {
  console.log(event);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
}

function onPointerMove(event) {
  pointer.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(objects, false);
  if (intersects.length > 0) {
    const intersect = intersects[0];
    // rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
    // rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
    renderer.render(scene, camera);
  }
}

function onPointerDown(event) {
  pointer.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(objects, false);
  if (intersects.length > 0) {
    const intersect = intersects[0];
    // if ( isShiftDown ) { // delete cube
    //   if ( intersect.object !== plane ) {
    //     scene.remove( intersect.object );
    //     objects.splice( objects.indexOf( intersect.object ), 1 );
    //   }
    // } else { // create cube
    const voxel = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }));
    // voxel.position.copy(intersect.point).add(intersect.face.normal);
    voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
    scene.add(voxel);
    objects.push(voxel);
    // }
    renderer.render(scene, camera);
  }
}

const animate = (domTimestamp) => {
  // group.rotation.y = t/3000;

  turnTowardsCamera(groups['dotLabelGroup'], orbitControls);
  // turnTowardsCamera(groups['vesselsGroup'], orbitControls);

  if (domTimestamp % 2000 < 16) { // every 2 seconds
    updateMissionStatus();

    // let url = new URL(window.location.href);
    // minLongitude = parseFloat(url.searchParams.get('lomin') || `${minLongitude}`);
    // maxLongitude = parseFloat(url.searchParams.get('lomax') || `${maxLongitude}`);
    // minLatitude = parseFloat(url.searchParams.get('lamin') || `${minLatitude}`);
    // maxLatitude = parseFloat(url.searchParams.get('lamax') || `${maxLatitude}`);

    drawLineBetweenTwoCities(scene, `los_angeles`, `london`);
  }

  orbitControls.update();
  bloomPass.strength = getSetting('bloom', 'strength');
  bloomPass.radius = getSetting('bloom', 'radius');
  renderer.render(scene, camera);
  composer.render();
}

export { initScene, scene, camera, renderer };
