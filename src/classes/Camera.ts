import { Vec2, Vec3 } from "../types";
import { Controller } from "./Controller";
import { Entity, EntityParams } from "./Entity";
import { Scene } from "./Scene";

type CameraParams = {
  aspectRatio: number;
  focalDistance: number;
  direction?: Vec3; // direction at which camera is pointing
  logFramerate?: boolean;
} & Pick<EntityParams, "position" | "localCoordinateSystem">;

type RenderSceneParams = {
  scene: Scene;
  width: number;
  height: number;
};

export class Camera extends Controller {
  private _aspectRatio: number;
  private _focalDistance: number;

  constructor({
    aspectRatio,
    focalDistance,
    localCoordinateSystem,
    position = [0, 0, -5],
  }: CameraParams) {
    super({ localCoordinateSystem, position });

    this._aspectRatio = aspectRatio;
    this._focalDistance = focalDistance;
  }

  public clipVisible(objects: Entity[]): Entity[] {
    // TODO: implement
    return objects;
  }

  public renderScene(
    buffer: Uint8ClampedArray,
    { scene, height, width }: RenderSceneParams
  ) {
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = 0;
    }

    const clippedObjects = this.clipVisible(scene.objects);

    const cone_lower = 0;
    const cone_upper = 100;

    const d = this._focalDistance;

    const setPixel = (x: number, y: number) => {
      const row = y * width * 4;
      const pos = row + x * 4;

      buffer[pos + 0] = 255;
      buffer[pos + 3] = 255;
    };

    const drawVerticalLine = ([x1, y1]: Vec2, [x2, y2]: Vec2) => {
      const dy = y2 - y1;

      const y_start = dy > 0 ? y1 : y2;
      const y_end = dy > 0 ? y2 : y1;

      let y = y_start;

      while (y < y_end) {
        setPixel(x1, y);
        y += 1;
      }

      return;
    };

    const drawLine = ([x1, y1]: Vec2, [x2, y2]: Vec2) => {
      const dx = x2 - x1;

      if (dx == 0) {
        drawVerticalLine([x1, y1], [x2, y2]);
        return;
      }

      const dy = y2 - y1;

      const m = dy / dx;

      const x_start = dx > 0 ? x1 : x2;
      const x_end = dx > 0 ? x2 : x1;

      const y_start = dx > 0 ? y1 : y2;

      let y = y_start;

      for (let x = x_start; x <= x_end; x++) {
        setPixel(x, Math.round(y));
        y = y + m;
      }
    };

    const drawLineBresenhama = ([x1, y1]: Vec2, [x2, y2]: Vec2) => {
      const dx = x2 - x1,
        dy = y2 - y1;

      const p1 = 2 * dy - dx,
        p2 = 2 * (dy - dx);

      let x = x1,
        y = y1,
        _d = 0;

      const xEnd = x2;

      while (x < xEnd) {
        x = x + 1;

        if (_d < 0) {
          _d = _d + p1;
        } else {
          _d = _d + p2;
          y = y + 1;
        }

        setPixel(x, y);
      }
    };

    clippedObjects.forEach((obj) => {
      if (!obj.mesh) return;

      const rastrizedVertices = obj.mesh?.vertices.map((vertex) => {
        const vertexInWorld = obj.transformVecToWorldSystem(vertex);

        const vertexInCamera =
          this.transformToCameraCoordinateSystem(vertexInWorld);

        const [x, y, z] = vertexInCamera;

        const isVertexInCone = cone_lower < z && z < cone_upper;

        if (!isVertexInCone) return null;

        const x_plane = (x * d) / (z + d);
        const y_plane = (y * d) / (z + d);

        const x_rastr = Math.floor(((x_plane + 1) / 2) * width);
        const y_rastr = Math.floor(((y_plane + 1) / 2) * height);

        setPixel(x_rastr, y_rastr);

        return [x_rastr, y_rastr] as Vec2;
      });

      obj.mesh.triangleIndices.forEach((triangle) => {
        [0, 1, 2].forEach((i) => {
          const current_i = triangle[i];
          const next_i = triangle[(i + 1) % 3];

          const current = rastrizedVertices[current_i];
          const next = rastrizedVertices[next_i];

          if (!current || !next) return;

          drawLine(current, next);
        });
      });
    });
  }

  private calculatePlane(aspectRatio: number) {
    const common = 1 + aspectRatio ** 2;

    const y = Math.sqrt(common) / common;
    const x = aspectRatio * y;

    return { x, y };
  }

  private transformToCameraCoordinateSystem(v: Vec3): Vec3 {
    return this.transformVecToLocalSystem(v);
  }
}
