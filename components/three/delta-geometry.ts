import * as THREE from "three";
import { RING_POINTS, BOWL_POINTS, BOWL_HOLE_POINTS } from "./logo-points";

function toShape(points: [number, number][], holes: [number, number][][] = []) {
  const shape = new THREE.Shape();
  points.forEach(([x, y], index) => {
    if (index === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  });
  shape.closePath();

  for (const holePoints of holes) {
    const hole = new THREE.Path();
    holePoints.forEach(([x, y], index) => {
      if (index === 0) hole.moveTo(x, y);
      else hole.lineTo(x, y);
    });
    hole.closePath();
    shape.holes.push(hole);
  }

  return shape;
}

/**
 * Extrudes the brand mark (see logo-points.ts, generated from the same SVG
 * path the LogoMark component renders) into a 3D solid.
 *
 * The mark is two disjoint pieces — the outer bracket-and-D ring, and the
 * inner bowl with its own counter — so it extrudes as two shapes rather
 * than one outline with holes. Treating the bowl as a hole in the ring
 * subtracts a region the ring never covered, which is what previously ate
 * the left bar and the corners.
 */
export function createDeltaGeometry(): THREE.ExtrudeGeometry {
  const geometry = new THREE.ExtrudeGeometry(
    [toShape(RING_POINTS), toShape(BOWL_POINTS, [BOWL_HOLE_POINTS])],
    {
      depth: 0.6,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelSegments: 4,
      curveSegments: 1,
    }
  );
  geometry.center();
  return geometry;
}
