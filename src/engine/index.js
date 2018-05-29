import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import getScene from './scene';

function initialize(element) {
  const clock = new THREE.Clock();
  const renderer = new THREE.WebGLRenderer({ canvas: element });
  renderer.setSize( element.offsetWidth, element.offsetHeight );
  renderer.shadowMap.enabled = true;

  const camera = new THREE.PerspectiveCamera( 75, element.offsetWidth/element.offsetHeight, 0.1, 1000 );

  // const controls = new TrackballControls(camera);
  const scene = getScene(camera);

  const axesHelper = new THREE.AxesHelper(5);

  scene.add(axesHelper);

  function animate() {
    requestAnimationFrame( animate );
    const delta = clock.getDelta();
    scene.onFrame(delta);
    // controls.update(delta);
    renderer.render( scene, camera );
  }
  animate();

}

export default {
  initialize,
}