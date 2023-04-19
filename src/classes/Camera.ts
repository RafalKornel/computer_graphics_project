import { Color, Vec2, Vec3 } from "../types";
import { ControlledEntity } from "./ControlledEntity";
import { EntityParams } from "./Entity";
import { Matrix } from "./Matrix";
import { Mesh } from "./Mesh";
import { Scene } from "./Scene";
import { dist } from "./vector";

type CameraParams = {
  buffer: Uint8ClampedArray;
  bufferWidth: number;
  width: number;
  height: number;
  focalDistance: number;
  coneLowerDist?: number;
  coneUpperDist?: number;
} & Pick<EntityParams, "position" | "localCoordinateSystem">;

export class Camera extends ControlledEntity {
  private readonly _bufferWidth: number;
  private _buffer: Uint8ClampedArray;

  private _width: number;
  private _height: number;
  private _aspectRatio: number;

  private _focalDistance: number;
  private _coneLowerDist: number;
  private _coneUpperDist: number;

  constructor({
    buffer,
    bufferWidth,
    height,
    width,
    focalDistance,
    coneLowerDist = 0,
    coneUpperDist = 100,
    localCoordinateSystem,
    position = [0, 0, -5],
  }: CameraParams) {
    super({ localCoordinateSystem, position });

    this._buffer = buffer;
    // this._zBuffer = new Uint8ClampedArray(width * height);
    this._bufferWidth = bufferWidth;

    this._width = width;
    this._height = height;
    this._aspectRatio = width / height;

    this._focalDistance = focalDistance;
    this._coneLowerDist = coneLowerDist;
    this._coneUpperDist = coneUpperDist;
  }

  public renderScene(scene: Scene) {
    for (let i = 0; i < this._buffer.length; i++) {
      this._buffer[i] = 0;
    }

    const sortedObjects = [...scene.objects].sort((objA, objB) => {
      const distToA = dist(this.position, objA.position);
      const distToB = dist(this.position, objB.position);

      return distToB - distToA;
    });

    sortedObjects.forEach((obj) => {
      if (!obj.mesh) return;

      const rastrizedVertices = obj.mesh.vertices.map((vertex) => {
        const vertexInWorld = obj.transformVecToWorldSystem(vertex);

        const vertexInCamera = this.transformVecToLocalSystem(vertexInWorld);

        const isVertexInCone =
          this._coneLowerDist < vertexInCamera[2] &&
          vertexInCamera[2] < this._coneUpperDist;

        if (!isVertexInCone) return null;

        const vertexInPlane = this.transformCameraToPlaneCoors(vertexInCamera);

        const rastrizedVertex = this.rastrize(vertexInPlane);

        this.setPixel(rastrizedVertex, obj.mesh!.color);

        return rastrizedVertex;
      });

      obj.mesh.rastrizedVertices = rastrizedVertices;

      obj.mesh.triangleIndices.forEach((triangle, idx) => {
        [0, 1, 2].forEach((i) => {
          const current_i = triangle[i];
          const next_i = triangle[(i + 1) % 3];

          const current = rastrizedVertices[current_i];
          const next = rastrizedVertices[next_i];

          if (!current || !next) return;

          // const color = obj.mesh!.color.map((v) => (v !== 0 ? v + 50 : v));

          // this.drawLine(current, next, color as Color);

          this.fillTriangle(obj.mesh!, idx);
        });
      });
    });
  }

  private fillTriangle(mesh: Mesh, triangleIndex: number) {
    const triangle = mesh.triangleIndices[triangleIndex];

    const p1 = mesh.rastrizedVertices[triangle[0]];
    const p2 = mesh.rastrizedVertices[triangle[1]];
    const p3 = mesh.rastrizedVertices[triangle[2]];

    if (!p1 || !p2 || !p3) return;

    let sortedPoints = [p1, p2, p3].sort((a, b) => a[1] - b[1]) as [
      Vec2,
      Vec2,
      Vec2
    ];

    let [sp0, sp1, sp2] = sortedPoints;

    let x01 = this.interpolate([sp0[1], sp0[0]], [sp1[1], sp1[0]]);
    let x12 = this.interpolate([sp1[1], sp1[0]], [sp2[1], sp2[0]]);
    let x02 = this.interpolate([sp0[1], sp0[0]], [sp2[1], sp2[0]]);

    x01.pop();

    const x012 = [...x01, ...x12];

    let left_x: Vec2[];
    let right_x: Vec2[];

    const m = Math.floor(x02.length / 2);

    if (x02[m] < x012[m]) {
      left_x = x02;
      right_x = x012;
    } else {
      left_x = x012;
      right_x = x02;
    }

    if (left_x.length !== right_x.length) {
      console.log({
        d: left_x.length - right_x.length,
        l: left_x.length,
        r: right_x.length,
      });
    }

    const y0 = sortedPoints[0][1];
    const y2 = sortedPoints[2][1];

    for (let y = y0; y < y2; y++) {
      let x0 = left_x[y - y0];
      let x1 = right_x[y - y0];

      const x_start = Math.min(x0[1], x1[1]);
      const x_end = Math.max(x0[1], x1[1]);

      const [r, g, b] = mesh.color!;

      for (let x = x_start; x < x_end; x++) {
        this.setPixel([x, y], [r, g, b]);
      }
    }
  }

  private interpolate([x1, y1]: Vec2, [x2, y2]: Vec2): Vec2[] {
    let points = [];

    const dx = x2 - x1;
    const dy = y2 - y1;

    if (dx == 0) {
      return [];
    }

    const m = dy / dx;

    const x_start = dx > 0 ? x1 : x2;
    const x_end = dx > 0 ? x2 : x1;

    const y_start = dx > 0 ? y1 : y2;

    let y = y_start;

    for (let x = x_start; x <= x_end; x++) {
      y = y + m;
      points.push([x, Math.round(y)] as Vec2);
    }

    return points;
  }

  public changeFocalDistance(d: number) {
    this._focalDistance = d;
  }

  private transformCameraToPlaneCoors([x, y, z]: Vec3): Vec2 {
    const x_plane = (x * this._focalDistance) / (z + this._focalDistance);
    const y_plane = (y * this._focalDistance) / (z + this._focalDistance);

    return [x_plane, y_plane];
  }

  private rastrize([x_plane, y_plane]: Vec2): Vec2 {
    const x_rastr = Math.floor(
      ((x_plane + 1) / this._aspectRatio / 2) * this._width
    );
    const y_rastr = Math.floor(((y_plane + 1) / 2) * this._height);

    return [x_rastr, y_rastr];
  }

  private getBufferPosition(x: number, y: number) {
    const row = y * this._width * this._bufferWidth;
    const pos = row + x * this._bufferWidth;

    const isInBound = y < this._height && x < this._width && x >= 0 && y >= 0;

    if (!isInBound) return null;

    return pos;
  }

  /** Passing array as argument of a function that is invoked frequently is inefficient,
   * but easier to read */
  private setPixel([x, y]: Vec2, color: Color) {
    const pos = this.getBufferPosition(x, y);

    if (!pos) return;

    const [r, g, b] = color;

    this._buffer[pos + 0] = r;
    this._buffer[pos + 1] = g;
    this._buffer[pos + 2] = b;
    this._buffer[pos + 3] = 255;
  }

  private drawLine([x1, y1]: Vec2, [x2, y2]: Vec2, color: Color) {
    let points: Vec2[];

    if (x1 === x2) {
      const dy = y2 - y1;

      points = new Array(Math.abs(dy))
        .fill(0)
        .map((_, i) => [x1, y1 + i * (dy > 0 ? 1 : -1)]);
    } else {
      points = this.interpolate([x1, y1], [x2, y2]);
    }

    points.forEach((p) => {
      this.setPixel(p, color);
    });
  }

  //   const dx = x2 - x1;

  //   if (dx == 0) {
  //     this.drawVerticalLine([x1, y1], [x2, y2], color);
  //     return;
  //   }

  //   const dy = y2 - y1;

  //   const m = dy / dx;

  //   const x_start = dx > 0 ? x1 : x2;
  //   const x_end = dx > 0 ? x2 : x1;

  //   const y_start = dx > 0 ? y1 : y2;

  //   let y = y_start;

  //   for (let x = x_start; x <= x_end; x++) {
  //     this.setPixel([x, Math.round(y)], color);
  //     y = y + m;
  //   }
  // }
}

// private fillTriangle(mesh: Mesh, triangleIndex: number) {
//   const triangle = mesh.triangleIndices[triangleIndex]!;

//   const p1 = mesh.rastrizedVertices[triangle[0]];
//   const p2 = mesh.rastrizedVertices[triangle[1]];
//   const p3 = mesh.rastrizedVertices[triangle[2]];

//   if (!p1 || !p2 || !p3) return;

//   const { max_x, max_y, min_x, min_y } = this.getBounds(p1, p2, p3);

//   let isInside = false;

//   for (let y = min_y; y < max_y; y++) {
//     isInside = false;

//     for (let x = min_x; x < max_x; x++) {
//       const isOnTheEdge = this.isOnEdgeOfTriangle([x, y], p1, p2, p3);

//       const isVertex =
//         (p1[0] === x && p1[1] === y) ||
//         (p2[0] === x && p2[1] === y) ||
//         (p3[0] === x && p3[1] === y);

//       // if (isVertex) {
//       // }

//       if (isOnTheEdge && !isVertex) {
//         // console.log({ p1, p2, p3, x, y });

//         isInside = !isInside;
//         continue;
//       }

//       // timesCrossed += 1;

//       // continue;

//       // const isOdd = timesCrossed % 2 === 1

//       if (isInside) {
//         this.setPixel([x, y], mesh.color);
//       }
//     }
//   }

//   // p1[0];

//   // console.log({ c_x, c_y, p1, p2, p3 });

//   // this.setPixel([c_x, c_y], mesh.color);
// }

// private isOnEdgeOfTriangle([x, y]: Vec2, p1: Vec2, p2: Vec2, p3: Vec2) {
//   const lines = [
//     [p1, p2],
//     [p2, p3],
//     [p3, p1],
//   ];

//   for (const [p_start, p_end] of lines) {
//     // if (x < p_start[0] || p_end[0] < x) return false;

//     const dx = p_end[0] - p_start[0];
//     const dy = p_end[1] - p_start[1];

//     if (dx < 1e-3) {
//       if (p_start[0] - x < 1e-3) return true;
//       continue;
//     }

//     if (dy < 1e-3) {
//       if (p_start[1] - y < 1e-3) return true;
//       continue;
//     }

//     const m = dy / dx;

//     const dx_1 = x - p_start[0];
//     const dy_1 = y - p_start[1];

//     const m_1 = dy_1 / dx_1;

//     if (Math.abs(m - m_1) < 1e-3) return true;

//     // const y1 = p_start[1] + Math.floor(x - p_start[0] * m);
//     // const x1 =

//     // const y1 = Math.floor(p_start[1] + n * dy);

//     // if (y1 === y) return true;
//   }

//   return false;
// }

// private fillTriangle(mesh: Mesh, triangleIndex: number) {
//   const triangle = mesh.triangleIndices[triangleIndex]!;

//   const p1 = mesh.rastrizedVertices[triangle[0]];
//   const p2 = mesh.rastrizedVertices[triangle[1]];
//   const p3 = mesh.rastrizedVertices[triangle[2]];

//   if ([p1, p2, p3].includes(null)) return;

//   const c_x = Math.floor((p1![0] + p2![0] + p3![0]) / 3);
//   const c_y = Math.floor((p1![1] + p2![1] + p3![1]) / 3);

//   this.fillTriangleAlgorithm(c_x, c_y, mesh.color);

//   // console.log({ c_x, c_y, p1, p2, p3 });

//   // this.setPixel([c_x, c_y], mesh.color);
// }

// private fillTriangleAlgorithm(x: number, y: number, color: Color) {
//   console.log(calls);
//   calls++;
//   // const pos = this.getBufferPosition(x, y);

//   // if (!pos) return;

//   // const r = this._buffer[pos + 0];
//   // const g = this._buffer[pos + 1];
//   // const b = this._buffer[pos + 2];

//   // if (r || g || b) {
//   //   return;
//   // }

//   const pos = this.getBufferPosition(x, y);

//   if (!pos) return;

//   this._buffer[pos + 0] = color[0];
//   this._buffer[pos + 1] = color[1];
//   this._buffer[pos + 2] = color[2];

//   this.setPixel([x, y], color);

//   const leftPos = this.getBufferPosition(x - 1, y);

//   if (leftPos && !this.isFilled(leftPos)) {
//     this.fillTriangleAlgorithm(x - 1, y, color);
//   }

//   const rightPos = this.getBufferPosition(x + 1, y);

//   if (rightPos && !this.isFilled(rightPos)) {
//     this.fillTriangleAlgorithm(x + 1, y, color);
//   }

//   const topPos = this.getBufferPosition(x, y + 1);

//   if (topPos && this.isFilled(topPos)) {
//     this.fillTriangleAlgorithm(x, y + 1, color);
//   }

//   const bottomPos = this.getBufferPosition(x, y - 1);

//   if (bottomPos && this.isFilled(bottomPos)) {
//     this.fillTriangleAlgorithm(x, y - 1, color);
//   }
// }
