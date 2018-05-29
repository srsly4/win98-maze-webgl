import * as THREE from 'three';
import scene from './scene';
import mazegen from './mazegen';

function initialize(element) {

  const renderer = new THREE.WebGLRenderer({ canvas: element });
  renderer.setSize( element.offsetWidth, element.offsetHeight );

  console.table(mazegen());


  const camera = new THREE.PerspectiveCamera( 75, element.offsetWidth/element.offsetHeight, 0.1, 1000 );
  camera.position.z = 5;

  function animate() {
    requestAnimationFrame( animate );

    scene.onFrame();
    renderer.render( scene, camera );
  }
  animate();

}

export default {
  initialize,
}