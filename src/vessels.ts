import * as THREE from 'three';

const createVesselsGroup = async () => {
  let material = new THREE.MeshBasicMaterial({ color: 'white' });
  let group = new THREE.Group();
  const numberOfVessels = Math.floor(Math.random() * 10 + 5);
  for (let i = 0; i < numberOfVessels; i++) {
    const mesh = new THREE.Mesh(new THREE.TetrahedronGeometry(0.1), material);
    mesh.position.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    group.add(mesh);
  };

  return group;
}

export { createVesselsGroup };