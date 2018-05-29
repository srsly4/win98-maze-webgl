import * as THREE from 'three';

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

scene.onFrame = () => {
  cube.rotation.x += 0.02;
  cube.rotation.y += 0.02;
};

export default scene;