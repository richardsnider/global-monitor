import * as THREE from 'three';

const createVesselsGroup = async () => {
  let material = new THREE.MeshBasicMaterial({ color: 'white' });
  let outline = new THREE.MeshBasicMaterial({ color: 'green', opacity: 0.5, /*side: THREE.BackSide*/ });
  let group = new THREE.Group();
  const numberOfVessels = Math.floor(Math.random() * 10 + 5);
  for (let i = 0; i < numberOfVessels; i++) {
    const mesh = new THREE.Mesh(new THREE.TetrahedronGeometry(0.1 /*radius*/), material);
    mesh.position.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    const circle = new THREE.Line(new THREE.CircleGeometry(0.2 /*radius*/, 32 /*segments*/), outline);
    circle.position.copy(mesh.position);
    group.add(mesh);
    group.add(circle);
  };

  return group;
}

export { createVesselsGroup };