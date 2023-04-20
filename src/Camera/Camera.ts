import { Color, Vec2, Vec3 } from "../types";

import { dist } from "../utils/vector";
import { interpolate } from "../utils/calculations";
import { Entity, EntityParams } from "../Entity";
import { EntityWithControls } from "../Entity";
import { Mesh } from "../Scene/Mesh";
import { Scene } from "../Scene/Scene";

type CameraParams = {
  buffer: Uint8ClampedArray;
  bufferWidth: number;
  width: number;
  height: number;
  focalDistance: number;
  coneLowerDist?: number;
  coneUpperDist?: number;
} & Pick<EntityParams, "position" | "localCoordinateSystem">;

export class Camera extends EntityWithControls {
  private readonly _bufferWidth: number;
  private _buffer: Uint8ClampedArray;

  private _width: number;
  private _height: number;
  private _aspectRatio: number;

  private _focalDistance: number;
  private _coneLowerDist: number;
  private _coneUpperDist: number;

  private _withPainterAlgorithm: boolean;

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
    this._bufferWidth = bufferWidth;

    this._width = width;
    this._height = height;
    this._aspectRatio = width / height;

    this._focalDistance = focalDistance;
    this._coneLowerDist = coneLowerDist;
    this._coneUpperDist = coneUpperDist;

    this._withPainterAlgorithm = true;
  }

  public changeFocalDistance(d: number) {
    this._focalDistance = d;
  }

  public togglePainterAlgorithm() {
    this._withPainterAlgorithm = !this._withPainterAlgorithm;
  }

  public renderScene(scene: Scene) {
    for (let i = 0; i < this._buffer.length; i++) {
      this._buffer[i] = 0;
    }

    const sortedObjects = this._withPainterAlgorithm
      ? this.painterAlgorithmSort(scene.objects)
      : scene.objects;

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

    let x01 = interpolate([sp0[1], sp0[0]], [sp1[1], sp1[0]]);
    let x12 = interpolate([sp1[1], sp1[0]], [sp2[1], sp2[0]]);
    let x02 = interpolate([sp0[1], sp0[0]], [sp2[1], sp2[0]]);

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

  private painterAlgorithmSort(objects: Entity[]): Entity[] {
    return [...objects].sort((objA, objB) => {
      const distToA = dist(this.position, objA.position);
      const distToB = dist(this.position, objB.position);

      return distToB - distToA;
    });
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
}
