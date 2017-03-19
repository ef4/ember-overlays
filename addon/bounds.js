const tolerance = 1;

export function boundsEqual(a, b) {
  if (a == null && b == null) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return Math.abs(a.top - b.top) < tolerance &&
    Math.abs(a.bottom - b.bottom) < tolerance &&
    Math.abs(a.left - b.left) < tolerance &&
    Math.abs(a.right - b.right) < tolerance;
}
