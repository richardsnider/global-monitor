import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { getSetting } from './gui';
import { createLabels } from './text';
import { createVesselsGroup } from './vessels';
import { turnLabelsTowardsCamera, drawLineBetweenTwoCities, updateData } from './util';
import { updateMissionStatus } from './console';


let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let orbitControls: OrbitControls;
let renderer: THREE.WebGLRenderer;
let groups: Record<string, THREE.Group> = {};
let bloomPass: UnrealBloomPass;
let composer: EffectComposer;

const initScene = async () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color('black');

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);

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

  const renderScene = new RenderPass( scene, camera );
  bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
  const outputPass = new OutputPass();

  composer = new EffectComposer( renderer );
  composer.addPass( renderScene );
  composer.addPass( bloomPass );
  composer.addPass( outputPass );

  window.addEventListener("resize", onWindowResize);
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

const animate = (domTimestamp) => {
  // group.rotation.y = t/3000;

  turnLabelsTowardsCamera(groups['dotLabelGroup'], orbitControls);

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
