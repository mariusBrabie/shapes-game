export function polygonPoints(sides, size) {
  const r = size / 2;
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
    points.push(r + Math.cos(angle) * r);
    points.push(r + Math.sin(angle) * r);
  }
  return points;
}

export function getRandomSize() {
  return 30 + Math.random() * 40;
}
