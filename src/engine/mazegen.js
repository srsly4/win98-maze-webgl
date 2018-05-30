export default function(width, height, complexity, density) {
  width = width || 14;
  height = height || 14;
  complexity = complexity || 0.75;
  density = density || 0.75;

  const shape = [Math.floor(height / 2) * 2 + 1, Math.floor(width / 2) * 2 + 1];
  complexity = complexity * (5 * (shape[1] + shape[0]));
  density = density * (Math.floor(shape[1] / 2) * Math.floor(shape[0] / 2));


  const Z = [];
  for (let x = 0; x < shape[0]; x++) {
    const inner = [];
    for (let y = 0; y < shape[1]; y++) {
      inner.push(0);
    }
    Z.push(inner);
  }

  for (let x = 0; x < shape[0]; x++) {
    Z[x][0] = 1;
    Z[x][shape[1]-1] = 1;
  }
  for (let y = 0; y < shape[1]; y++) {
    Z[0][y] = 1;
    Z[shape[0]-1][y] = 1;
  }

  for (let i = 0; i < density; i++) {
    let x = Math.floor(Math.random()*(shape[0]/2))*2;
    let y = Math.floor(Math.random()*(shape[1]/2))*2;
    Z[x][y] = 1;

    for (let j = 0; j < complexity; j++) {
      const neighbours = [];
      if (x > 1) {
        neighbours.push([x - 2, y]);
      }
      if (x < shape[0] - 2) {
        neighbours.push([x + 2, y]);
      }
      if (y > 1) {
        neighbours.push([x, y - 2]);
      }
      if (y < shape[1] - 2) {
        neighbours.push([x, y + 2]);
      }

      if (neighbours.length > 0) {
        const randNeighbour = neighbours[Math.floor(Math.random()*neighbours.length)];
        const x_ = randNeighbour[0];
        const y_ = randNeighbour[1];
        if (Z[x_][y_] === 0) {
          Z[x_][y_] = 1;
          Z[x_ + Math.floor((x - x_) / 2)][y_ + Math.floor((y - y_) / 2)] = 1;
          x = x_;
          y = y_;
        }
      }
    }

  }

  const xCenter = width / 2;
  const yCenter = height / 2;
  Z[xCenter][yCenter] = 0;
  // Z[xCenter][yCenter-1] = 0;
  // Z[xCenter][yCenter+1] = 0;
  // Z[xCenter-1][yCenter] = 0;
  // Z[xCenter-1][yCenter-1] = 0;
  // Z[xCenter-1][yCenter+1] = 0;
  Z[xCenter+1][yCenter] = 0;
  // Z[xCenter+1][yCenter-1] = 0;
  // Z[xCenter+1][yCenter+1] = 0;

  return Z;
}