import * as THREE from 'three';
import mazegen from './mazegen';

export default function() {
  const scene = new THREE.Scene();

  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  const width = 20;
  const height = 20;
  const maze = mazegen(width, height, 0.75, 0.75);
  console.table(maze);


  const relPosX = -1 * (width/2) - 0.5;
  const floorY = 0;
  const relPosZ = -1 * (height/2) - 0.5;
  const floorGeometry = new THREE.Geometry();
  const floorVertices = [];
  const floorFaces = [];

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (maze[x][y] === 0) {
        floorVertices.push(new THREE.Vector3(relPosX+x, floorY, relPosZ+y));
        floorVertices.push(new THREE.Vector3(relPosX+x+1, floorY, relPosZ+y));
        floorVertices.push(new THREE.Vector3(relPosX+x, floorY, relPosZ+y+1));
        floorVertices.push(new THREE.Vector3(relPosX+x+1, floorY, relPosZ+y+1));
        const vertNdx = floorVertices.length-4;
        floorFaces.push(new THREE.Face3(vertNdx, vertNdx+1, vertNdx+2));
        floorFaces.push(new THREE.Face3(vertNdx+3, vertNdx+2, vertNdx+1));
      }
    }
  }

  floorGeometry.vertices = floorVertices;
  floorGeometry.faces = floorFaces;
  const floorMaterial  = new THREE.MeshBasicMaterial( { color: 0xdd1100 } );
  floorMaterial.side = THREE.DoubleSide;

  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -1;
  scene.add(floor);

  scene.onFrame = () => {
    cube.rotation.x += 0.02;
    cube.rotation.y += 0.02;
  };
  return scene;
};