import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import getScene from './scene';

function initialize(element) {
  const clock = new THREE.Clock();
  const renderer = new THREE.WebGLRenderer({ canvas: element });
  renderer.setSize( element.offsetWidth, element.offsetHeight );
  renderer.shadowMap.enabled = true;

  const camera = new THREE.PerspectiveCamera( 75, element.offsetWidth/element.offsetHeight, 0.1, 1000 );

  const controlledCamera = new THREE.PerspectiveCamera(75, element.offsetWidth/element.offsetHeight, 0.1, 1000);
  controlledCamera.position.y = 0.5;
  const controls = new TrackballControls(controlledCamera);
  const scene = getScene(camera);

  // const axesHelper = new THREE.AxesHelper(5);
  // scene.add(axesHelper);

  function animate() {
    requestAnimationFrame( animate );
    const delta = clock.getDelta();
    controls.update(delta);
    scene.onFrame(delta);
    renderer.render( scene, camera );
  }
  animate();

}

export default {
  initialize,
}