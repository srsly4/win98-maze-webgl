import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import getScene from './scene';

let isFreeCamera = false;
let currentCamera = null;
let camera, controlledCamera;
let scene;
let domElement;
let renderer;

let areWaypointsVisible = false;

function toggleCamera() {
  isFreeCamera = !isFreeCamera;
  currentCamera = isFreeCamera ? controlledCamera : camera;
  scene && typeof scene.setCeilingVisibility === 'function'
  && scene.setCeilingVisibility(!isFreeCamera);
}

function toggleWaypoints() {
  areWaypointsVisible = !areWaypointsVisible;

  scene && typeof scene.setWaypointsVisibility === 'function'
    && scene.setWaypointsVisibility(areWaypointsVisible);
}

function initialize(element) {
  domElement = element;
  const clock = new THREE.Clock();
  renderer = new THREE.WebGLRenderer({ canvas: element });
  renderer.setSize( element.offsetWidth, element.offsetHeight );
  renderer.shadowMap.enabled = true;

  currentCamera = camera = new THREE.PerspectiveCamera( 75, element.offsetWidth/element.offsetHeight, 0.1, 1000 );

  controlledCamera = new THREE.PerspectiveCamera(75, element.offsetWidth/element.offsetHeight, 0.1, 1000);
  controlledCamera.position.y = 5;
  const controls = new TrackballControls(controlledCamera);
  scene = getScene(camera);

  // const axesHelper = new THREE.AxesHelper(5);
  // scene.add(axesHelper);

  function animate() {
    requestAnimationFrame( animate );
    const delta = clock.getDelta();
    controls.update(delta);
    scene.onFrame(delta);
    renderer.render( scene, currentCamera );
  }
  animate();

}

function onWindowResize() {
  // fixme: resizing renderer cause crash
  // if (!renderer) {
  //   return;
  // }
  // currentCamera.aspect = domElement.innerWidth / domElement.innerHeight;
  // currentCamera.updateProjectionMatrix();
  // renderer.setSize( window.domElement, domElement.innerHeight );
}

export default {
  initialize,
  toggleCamera,
  toggleWaypoints,
  onWindowResize,
}