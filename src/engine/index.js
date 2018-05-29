import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import getScene from './scene';

function initialize(element) {
  const clock = new THREE.Clock();
  const renderer = new THREE.WebGLRenderer({ canvas: element });
  renderer.setSize( element.offsetWidth, element.offsetHeight );

  const camera = new THREE.PerspectiveCamera( 75, element.offsetWidth/element.offsetHeight, 0.1, 1000 );
  camera.position.z = 5;

  const controls = new TrackballControls(camera);

  const scene = getScene();

  function animate() {
    requestAnimationFrame( animate );
    const delta = clock.getDelta();
    scene.onFrame();
    controls.update(delta);
    renderer.render( scene, camera );
  }
  animate();

}

export default {
  initialize,
}