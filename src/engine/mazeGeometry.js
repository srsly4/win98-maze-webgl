import * as THREE from 'three';

export default function(maze, width, height) {
  const relPosX = -1 * (width/2) - 0.5;
  const floorY = 0;
  const relPosZ = -1 * (height/2) - 0.5;
  const floorGeometry = new THREE.Geometry();
  const floorVertices = [];
  const floorFaces = [];

  const wallGeometry = new THREE.Geometry();
  const wallVertices = [];
  const wallFaces = [];
  const wallHeight = 1;

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

        floorGeometry.faceVertexUvs[0].push([
          new THREE.Vector2(0, 0),
          new THREE.Vector2(1, 0),
          new THREE.Vector2(0, 1)]);
        floorGeometry.faceVertexUvs[0].push([
          new THREE.Vector2(1, 1),
          new THREE.Vector2(0, 1),
          new THREE.Vector2(1, 0)]);

        // left wall
        if (x > 0 && maze[x-1][y]) {
          wallVertices.push(new THREE.Vector3(relPosX+x, floorY, relPosZ+y));
          wallVertices.push(new THREE.Vector3(relPosX+x, floorY, relPosZ+y+1));
          wallVertices.push(new THREE.Vector3(relPosX+x, floorY+wallHeight, relPosZ+y+1));
          wallVertices.push(new THREE.Vector3(relPosX+x, floorY+wallHeight, relPosZ+y));

          const vertNdx = wallVertices.length-4;
          wallFaces.push(new THREE.Face3(vertNdx+2, vertNdx+1, vertNdx));
          wallFaces.push(new THREE.Face3(vertNdx+3, vertNdx+2, vertNdx));

          wallGeometry.faceVertexUvs[0].push([
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0, 1),
            new THREE.Vector2(1, 1)]);
          wallGeometry.faceVertexUvs[0].push([
            new THREE.Vector2(1, 0),
            new THREE.Vector2(0, 0),
            new THREE.Vector2(1, 1)]);
        }

        // top wall
        if (y > 0 && maze[x][y-1]) {
          wallVertices.push(new THREE.Vector3(relPosX+x+1, floorY, relPosZ+y));
          wallVertices.push(new THREE.Vector3(relPosX+x, floorY, relPosZ+y));
          wallVertices.push(new THREE.Vector3(relPosX+x, floorY+wallHeight, relPosZ+y));
          wallVertices.push(new THREE.Vector3(relPosX+x+1, floorY+wallHeight, relPosZ+y));

          const vertNdx = wallVertices.length-4;
          wallFaces.push(new THREE.Face3(vertNdx+2, vertNdx+1, vertNdx));
          wallFaces.push(new THREE.Face3(vertNdx+3, vertNdx+2, vertNdx));


          wallGeometry.faceVertexUvs[0].push([
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0, 1),
            new THREE.Vector2(1, 1)]);
          wallGeometry.faceVertexUvs[0].push([
            new THREE.Vector2(1, 0),
            new THREE.Vector2(0, 0),
            new THREE.Vector2(1, 1)]);
        }

        // right wall
        if (x < width && maze[x+1][y]) {
          wallVertices.push(new THREE.Vector3(relPosX+x+1, floorY, relPosZ+y));
          wallVertices.push(new THREE.Vector3(relPosX+x+1, floorY, relPosZ+y+1));
          wallVertices.push(new THREE.Vector3(relPosX+x+1, floorY+wallHeight, relPosZ+y+1));
          wallVertices.push(new THREE.Vector3(relPosX+x+1, floorY+wallHeight, relPosZ+y));

          const vertNdx = wallVertices.length-4;
          wallFaces.push(new THREE.Face3(vertNdx, vertNdx+1, vertNdx+2));
          wallFaces.push(new THREE.Face3(vertNdx, vertNdx+2, vertNdx+3));


          wallGeometry.faceVertexUvs[0].push([
            new THREE.Vector2(0, 1),
            new THREE.Vector2(1, 1),
            new THREE.Vector2(1, 0)]);
          wallGeometry.faceVertexUvs[0].push([
            new THREE.Vector2(0, 1),
            new THREE.Vector2(1, 0),
            new THREE.Vector2(0, 0)]);
        }

        // bottom wall
        if (y < height && maze[x][y+1]) {
          wallVertices.push(new THREE.Vector3(relPosX+x+1, floorY, relPosZ+y+1));
          wallVertices.push(new THREE.Vector3(relPosX+x, floorY, relPosZ+y+1));
          wallVertices.push(new THREE.Vector3(relPosX+x, floorY+wallHeight, relPosZ+y+1));
          wallVertices.push(new THREE.Vector3(relPosX+x+1, floorY+wallHeight, relPosZ+y+1));

          const vertNdx = wallVertices.length-4;
          wallFaces.push(new THREE.Face3(vertNdx, vertNdx+1, vertNdx+2));
          wallFaces.push(new THREE.Face3(vertNdx, vertNdx+2, vertNdx+3));


          wallGeometry.faceVertexUvs[0].push([
            new THREE.Vector2(0, 1),
            new THREE.Vector2(1, 1),
            new THREE.Vector2(1, 0)]);
          wallGeometry.faceVertexUvs[0].push([
            new THREE.Vector2(0, 1),
            new THREE.Vector2(1, 0),
            new THREE.Vector2(0, 0)]);
        }
      }
    }
  }

  floorGeometry.vertices = floorVertices;
  floorGeometry.faces = floorFaces;
  floorGeometry.computeFaceNormals();

  wallGeometry.vertices = wallVertices;
  wallGeometry.faces = wallFaces;
  wallGeometry.uvsNeedUpdate = true;
  wallGeometry.computeFaceNormals();

  return {
    wallGeometry,
    floorGeometry,
  };
}