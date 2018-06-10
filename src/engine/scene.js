import * as THREE from 'three';
import mazegen from './mazegen';
import mazeGeometry from './mazeGeometry';
import mazeCameraSpline from './mazeCameraSpline';

import FBXLoader from 'three-fbx-loader';

export default function(camera) {
  const scene = new THREE.Scene();
  scene.camera = camera;

  const textureLoader = new THREE.TextureLoader();
  textureLoader.setPath('textures/');

  const fbxLoader = new FBXLoader();

  const width = 20;
  const height = 20;
  const maze = mazegen(width, height, 0.75, 0.75);
  console.table(maze);

  const { floorGeometry, wallGeometry } = mazeGeometry(maze, width, height);

  const ceilingMaterial = new THREE.MeshPhongMaterial({
    color: 0xbbbbbb,
    shininess: 0.1,
    specular: 0x222222,
    map: textureLoader.load("Concrete_008_COLOR.jpg"),
    specularMap: textureLoader.load("Concrete_008_ROUGH.jpg"),
    normalMap: textureLoader.load("Concrete_008_NRM.jpg"),
    bumpMap: textureLoader.load("Concrete_008_DISP.jpg"),
    aoMap: textureLoader.load("Concrete_008_OCC.jpg"),
    displacementMap: textureLoader.load("Concrete_008_DISP.jpg"),
  });

  ceilingMaterial.side = THREE.FrontSide;

  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x999999,
    specular: 0x222222,
    roughness: 0.2,
    map: textureLoader.load("Cobblestone_001_COLOR.jpg"),
    roughnessMap: textureLoader.load("Cobblestone_001_ROUGH.jpg"),
    normalMap: textureLoader.load("Cobblestone_001_NORM.jpg"),
    bumpMap: textureLoader.load("Cobblestone_001_DISP.jpg"),
    aoMap: textureLoader.load("Cobblestone_001_OCC.jpg"),
    displacementMap: textureLoader.load("Cobblestone_001_DISP.jpg"),
  });
  floorMaterial.side = THREE.BackSide;

  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.receiveShadow = true;
  scene.add(floor);

  const ceiling = new THREE.Mesh(floorGeometry, ceilingMaterial);
  ceiling.receiveShadow = true;
  ceiling.position.y = 1;
  scene.add(ceiling);
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

  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x999999,
    metalness: 0.0,
    roughness: 1.0,
    bumpScale: 2.0,
    normalScale: new THREE.Vector2(1, 1),
    map: textureLoader.load("Brick_wall_002_COLOR.jpg"),
    // roughnessMap: textureLoader.load("Brick_wall_002_SPEC.jpg"),
    metalnessMap: textureLoader.load("Brick_wall_002_SPEC.jpg"),
    normalMap: textureLoader.load("Brick_wall_002_NORM.jpg"),
    bumpMap: textureLoader.load("Brick_wall_002_DISP.jpg"),
    aoMap: textureLoader.load("Brick_wall_002_AO.jpg"),
    displacementMap: textureLoader.load("Brick_wall_002_DISP.jpg"),
  });
  // wallMaterial.side = THREE.DoubleSide;

  const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  wall.castShadow = true;
  wall.receiveShadow = true;
  scene.add(wall);

  const ambientLight = new THREE.AmbientLight( 0x303030, 0.25 );
  // const ambientLight = new THREE.AmbientLight( 0xffffff, 0.8 );
  scene.add( ambientLight );

  const light = new THREE.PointLight( 0xeead5e, 0.8, 4.5 );
  // light.position.set( 0, 25, 0 );
  light.position.y = 0.65;
  light.castShadow = true;
  scene.add( light );

  camera.position.y = 0.5;

  const cameraSteps = 500;
  const cameraPath = mazeCameraSpline(maze, width, height, cameraSteps);
  const tubeGeometry = new THREE.TubeGeometry(cameraPath, cameraSteps*4, 0.01, 4, false);
  const tubeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
  const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
  scene.add(tube);
  tube.visible = false;

  const testMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const testGeometry = new THREE.CubeGeometry(0.1, 0.1, 0.1);
  const testParent = new THREE.Object3D();
  for (const point of cameraPath.points) {
    const boxPoint = new THREE.Mesh(testGeometry, testMaterial);
    boxPoint.position.copy(point);
    testParent.add(boxPoint);
  }
  scene.add(testParent);
  testParent.visible = false;


  let diamonds = { children: [] };
  fbxLoader.load('models/DiamondGem.FBX', (object3d) => {
    const diamondGeometry = object3d.children[0].geometry;
    const diamondMaterial = object3d.children[0].material;

    diamondMaterial.transparent = true;
    diamondMaterial.opacity = 0.75;
    diamondMaterial.castShadow = false;
    diamondMaterial.receiveShadow = false;
    diamondMaterial.shininess = 80;

    const relPosX = -1 * (width/2);
    const diamondY = 0.6;
    const diamondLightY = 0.9;
    const relPosZ = -1 * (height/2);

    diamonds = new THREE.Object3D();
    for (let x = 1; x < width-1; x++) {
      for (let y = 1; y < height-1; y++) {
        if (maze[x][y] === 0) {
          let borders = 0;
          borders += maze[x+1][y];
          borders += maze[x-1][y];
          borders += maze[x][y+1];
          borders += maze[x][y-1];

          if (borders === 3 && Math.random() < 0.4) {
            const diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
            diamond.scale.set(0.03, 0.03, 0.03);
            diamond.rotation.x = Math.PI/2;
            diamond.position.x = relPosX + x;
            diamond.position.y = diamondY;
            diamond.position.z = relPosZ + y;
            diamonds.add(diamond);

            const diamondLight = new THREE.PointLight(0x2211ff, 0.6, 1.5);
            diamondLight.castShadow = false;
            diamondLight.position.x = relPosX + x;
            diamondLight.position.y = diamondLightY;
            diamondLight.position.z = relPosZ + y;
            diamonds.add(diamondLight);
          }
        }
      }
    }
    scene.add(diamonds);

  });


  const speed = 0.75;

  const inSecondMovementUpdated = speed / cameraPath.points.length;

  let pathPercentage = 0.0;
  console.log(camera.up);
  const cameraLatency = 0.5;
  const torchLatency = 0.3;

  scene.setWaypointsVisibility = function(visibility) {
    testParent.visible = visibility;
    tube.visible = visibility;
  };

  scene.setCeilingVisibility = function(visibility) {
    ceiling.visible = visibility;
  };


  scene.onFrame = (delta) => {
    // camera position
    pathPercentage += inSecondMovementUpdated*delta;
    if (pathPercentage >= 1.0) {
      pathPercentage = 0;
    }
    const cameraPos = cameraPath.getPointAt(pathPercentage);
    camera.position.copy(cameraPos);

    const lightPos = cameraPath.getPointAt(Math.max(0.0, pathPercentage-(torchLatency*inSecondMovementUpdated)));
    light.position.copy(lightPos);
    light.position.x += 0.2*Math.sin(pathPercentage*400);
    light.position.y += 0.05*Math.sin(pathPercentage*430);
    light.position.z += 0.2*Math.sin(pathPercentage*450);

    // rotation
    camera.up.x = 0.1*Math.sin(pathPercentage*600);
    camera.up.z = 0.1*Math.sin(pathPercentage*500 + 1);
    const futureCameraPos = cameraPath.getPointAt(pathPercentage+(cameraLatency*inSecondMovementUpdated));
    camera.matrix.lookAt(cameraPos, futureCameraPos, camera.up);
    camera.rotation.setFromRotationMatrix(camera.matrix, camera.rotation.order);

    // camera.rotation.setFromRotationMatrix( camera.matrix, camera.rotation.order );
    // camera.rotation.set(
    //   camera.rotation.x + Math.sin(currTime/1000)*0.05,
    //   camera.rotation.y + Math.sin(currTime/1000 +1)*0.05,
    //   camera.rotation.z + Math.sin(currTime/1000 +2)*0.05
    // );

    for (const diamond of diamonds.children) {
      diamond.rotation.z += delta * 2;
    }
    // cameraHelper.update();
  };
  return scene;
};