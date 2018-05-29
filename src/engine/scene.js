import * as THREE from 'three';
import mazegen from './mazegen';
import mazeGeometry from './mazeGeometry';
import mazeCameraSpline from './mazeCameraSpline';

export default function(camera) {
  const scene = new THREE.Scene();
  scene.camera = camera;

  const textureLoader = new THREE.TextureLoader();
  textureLoader.setPath('textures/');

  const width = 20;
  const height = 20;
  const maze = mazegen(width, height, 0.5, 0.5);
  console.table(maze);

  const { floorGeometry, wallGeometry } = mazeGeometry(maze, width, height);

  const ceilingMaterial = new THREE.MeshPhongMaterial({
    color: 0xbbbbbb,
    specular: 0x222222,
    shininess: 5,
    map: textureLoader.load("Concrete_008_COLOR.jpg"),
    specularMap: textureLoader.load("Concrete_008_ROUGH.jpg"),
    normalMap: textureLoader.load("Concrete_008_NRM.jpg"),
    bumpMap: textureLoader.load("Concrete_008_DISP.jpg"),
    aoMap: textureLoader.load("Concrete_008_OCC.jpg"),
    displacementMap: textureLoader.load("Concrete_008_DISP.jpg"),
  });
  ceilingMaterial.side = THREE.DoubleSide;

  const floorMaterial  = new THREE.MeshLambertMaterial( { color: 0xdd1100 } );
  floorMaterial.side = THREE.DoubleSide;

  const floor = new THREE.Mesh(floorGeometry, ceilingMaterial);
  floor.receiveShadow = true;
  scene.add(floor);
  // const wallShader = parallaxShader;
  // const wallUniforms = THREE.UniformsUtils.clone( wallShader.uniforms );
  // const wallParameters = {
  //   fragmentShader: wallShader.fragmentShader,
  //   vertexShader: wallShader.vertexShader,
  //   uniforms: wallUniforms
  // };
  //
  // const wallMaterial = new THREE.ShaderMaterial( wallParameters );
  // wallMaterial.map = textureLoader.load( 'Brick_wall_002_COLOR.jpg' );
  // wallMaterial.bumpMap = textureLoader.load( 'Brick_wall_002_DISP.jpg' );
  // wallMaterial.map.anisotropy = 4;
  // wallMaterial.bumpMap.anisotropy = 4;
  // wallUniforms[ 'map' ].value = wallMaterial.map;
  // wallUniforms[ 'bumpMap' ].value = wallMaterial.bumpMap;

  const wallMaterial = new THREE.MeshPhongMaterial({
    color: 0x999999,
    specular: 0x222222,
    shininess: 35,
    map: textureLoader.load("Brick_wall_002_COLOR.jpg"),
    specularMap: textureLoader.load("Brick_wall_002_SPEC.jpg"),
    normalMap: textureLoader.load("Brick_wall_002_NORM.jpg"),
    bumpMap: textureLoader.load("Brick_wall_002_DISP.jpg"),
    aoMap: textureLoader.load("Brick_wall_002_AO.jpg"),
    displacementMap: textureLoader.load("Brick_wall_002_DISP.jpg"),
    normalScale: new THREE.Vector2( 0.8, 0.8 )
  });
  // wallMaterial.side = THREE.DoubleSide;

  const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  wall.castShadow = true;
  wall.receiveShadow = true;
  scene.add(wall);

  const ambientLight = new THREE.AmbientLight( 0x202020, 0.2 );
  scene.add( ambientLight );

  const light = new THREE.PointLight( 0xeedd88, 0.7, 2.5 );
  // light.position.set( 0, 25, 0 );
  light.position.y = 0.5;
  light.castShadow = true;
  scene.add( light );

  camera.position.y = 0.5;

  const cameraSteps = 500;
  const cameraPath = mazeCameraSpline(maze, width, height, cameraSteps);
  console.log(cameraPath);
  const tubeGeometry = new THREE.Geometry(cameraPath);
  const tubeMaterial = new THREE.LineBasicMaterial({color: 0xff0000});
  const tube = new THREE.Line(tubeGeometry, tubeMaterial);
  scene.add(tube);

  const speed = 1;

  const inSecondMovementUpdated = speed / cameraSteps;
  console.log(inSecondMovementUpdated);

  let pathPercentage = 0.0;

  const cameraLatency = 0.5;

  const normal = new THREE.Vector3();
  const binormal = new THREE.Vector3();

  scene.onFrame = (delta) => {
    // camera position
    pathPercentage += inSecondMovementUpdated*delta;
    if (pathPercentage >= 1.0) {
      pathPercentage = 0;
    }
    const cameraPos = cameraPath.getPointAt(pathPercentage);
    camera.position.copy(cameraPos);
    light.position.copy(cameraPos);

    // rotation
    const futureCameraPos = cameraPath.getPointAt(pathPercentage+(cameraLatency*inSecondMovementUpdated));
    camera.matrix.lookAt(cameraPos, futureCameraPos, normal);
    camera.rotation.setFromRotationMatrix( camera.matrix, camera.rotation.order );
    // console.log(cameraPath.getTangentAt(pathPercentage));
  };
  return scene;
};