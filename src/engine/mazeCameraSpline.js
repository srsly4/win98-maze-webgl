import * as THREE from 'three';

export default function(maze, width, height, steps) {
  const maxSteps = steps || 50;
  const xStart = width / 2;
  const yStart = height / 2;

  const visited = maze.map(inner => inner.map(() => false));

  const mapDirection = {
    0: (pos) => [pos[0], pos[1]-1],
    1: (pos) => [pos[0]+1, pos[1]],
    2: (pos) => [pos[0], pos[1]+1],
    3: (pos) => [pos[0]-1, pos[1]],
  };

  const isThereWay = (pos) => {
    return maze[pos[0]][pos[1]] === 0;
  };

  const isVisited = (pos) => {
    return visited[pos[0]][pos[1]];
  };

  const path = [[xStart, yStart], [xStart+1, yStart]];
  visited[xStart][yStart] = true;
  visited[xStart+1][yStart] = true;
  let position = [xStart+1, yStart];
  let direction = 1;
  let step = 0;

  const returnStepAway = 0.25;
  const relativeDirectionPriorities = [1, 0, 3, 2];

  const absoluteMapFunc = (a) => (direction+a)%4;
  while (step < maxSteps) {
    let absoluteDirectionPriorities = relativeDirectionPriorities.map(absoluteMapFunc);
    if (isVisited(mapDirection[absoluteDirectionPriorities[0]](position))) {
      const [first, ...rest] = absoluteDirectionPriorities;
      absoluteDirectionPriorities = [...rest, first];
    }

    let ndx = 0;
    while (!isThereWay(mapDirection[absoluteDirectionPriorities[ndx]](position))) {
      ndx += 1;
      if (ndx > 3) {
        throw new Error("Loop detected!");
      }
    }

    // if return, do better animation
    direction = absoluteDirectionPriorities[ndx];
    position = mapDirection[direction](position);
    if (relativeDirectionPriorities[ndx] === 2) {
      path.pop();
      path.pop();
      switch (direction) {
        case 0:
          path.push([position[0]+returnStepAway, position[1]]);
          // path.push([position[0], position[1]+returnStepAway]);
          path.push([position[0]-returnStepAway, position[1]]);
          break;
        case 1:
          path.push([position[0], position[1]-returnStepAway]);
          // path.push([position[0]-returnStepAway, position[1]]);
          path.push([position[0], position[1]+returnStepAway]);
          break;
        case 2:
          path.push([position[0]-returnStepAway, position[1]]);
          // path.push([position[0], position[1]-returnStepAway]);
          path.push([position[0]+returnStepAway, position[1]]);
          break;
        case 3:
          path.push([position[0], position[1]-returnStepAway]);
          // path.push([position[0]+returnStepAway, position[1]]);
          path.push([position[0], position[1]+returnStepAway]);
          break;
        default:
          break;
      }
    } else {
      path.push([position[0], position[1]]);
    }

    step += 1;
  }

  const relPosX = -1 * (width/2);
  const cameraY = 0.5;
  const relPosZ = -1 * (height/2);

  const cameraPath = path.map((pos) => new THREE.Vector3(relPosX + pos[0], cameraY, relPosZ + pos[1]));

  return new THREE.CatmullRomCurve3(cameraPath, false, 'chordal');
}