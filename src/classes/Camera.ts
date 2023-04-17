import { Vec2, Vec3 } from "../types";
import { Controller } from "./Controller";
import { EntityParams } from "./Entity";
import { Scene } from "./Scene";

type CameraParams = {
  buffer: Uint8ClampedArray;
  width: number;
  height: number;
  focalDistance: number;
  coneLowerDist?: number;
  coneUpperDist?: number;
} & Pick<EntityParams, "position" | "localCoordinateSystem">;

export class Camera extends Controller {
  private _buffer: Uint8ClampedArray;

  private _width: number;
  private _height: number;
  private _aspectRatio: number;

  private _focalDistance: number;
  private _coneLowerDist: number;
  private _coneUpperDist: number;

  constructor({
    buffer,
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

    scene.objects.forEach((obj) => {
      if (!obj.mesh) return;

      const rastrizedVertices = obj.mesh?.vertices.map((vertex) => {
        const vertexInWorld = obj.transformVecToWorldSystem(vertex);

        const vertexInCamera = this.transformVecToLocalSystem(vertexInWorld);

        const isVertexInCone =
          this._coneLowerDist < vertexInCamera[2] &&
          vertexInCamera[2] < this._coneUpperDist;

        if (!isVertexInCone) return null;

        const vertexInPlane = this.transformCameraToPlaneCoors(vertexInCamera);

        const rastrizedVertex = this.rastrize(vertexInPlane);

        this.setPixel(rastrizedVertex);

        return rastrizedVertex;
      });

      obj.mesh.triangleIndices.forEach((triangle) => {
        [0, 1, 2].forEach((i) => {
          const current_i = triangle[i];
          const next_i = triangle[(i + 1) % 3];

          const current = rastrizedVertices[current_i];
          const next = rastrizedVertices[next_i];

          if (!current || !next) return;

          this.drawLine(current, next);
        });
      });
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

  /** Passing array as argument of a function that is invoked frequently is inefficient,
   * but easier to read */
  private setPixel([x, y]: Vec2) {
    const row = y * this._width * 4;
    const pos = row + x * 4;

    if (y >= this._height || x >= this._width || x < 0 || y < 0) return;

    this._buffer[pos + 0] = 255;
    this._buffer[pos + 3] = 255;
  }

  private drawVerticalLine([x1, y1]: Vec2, [, y2]: Vec2) {
    const dy = y2 - y1;

    const y_start = dy > 0 ? y1 : y2;
    const y_end = dy > 0 ? y2 : y1;

    let y = y_start;

    while (y < y_end) {
      this.setPixel([x1, y]);
      y += 1;
    }

    return;
  }

  private drawLine([x1, y1]: Vec2, [x2, y2]: Vec2) {
    const dx = x2 - x1;

    if (dx == 0) {
      this.drawVerticalLine([x1, y1], [x2, y2]);
      return;
    }

    const dy = y2 - y1;

    const m = dy / dx;

    const x_start = dx > 0 ? x1 : x2;
    const x_end = dx > 0 ? x2 : x1;

    const y_start = dx > 0 ? y1 : y2;

    let y = y_start;

    for (let x = x_start; x <= x_end; x++) {
      this.setPixel([x, Math.round(y)]);
      y = y + m;
    }
  }
}
