import { CoordinateSystem } from "./CoordinateSystem";
import { Entity } from "./Entity";
import { Mesh } from "./Mesh";

export class Scene {
  objects: Entity[];
  readonly coordinateSystem: CoordinateSystem;

  constructor() {
    this.objects = [];

    this.coordinateSystem = new CoordinateSystem(
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    );
  }

  public addObject(object: Entity) {
    this.objects.push(object);
  }

  public transformMeshVerciesToWorldCoords(obj: Entity) {
    if (!obj.mesh) return undefined;

    const mappedVertices = obj.mesh.vertices.map((v) =>
      obj.transformVecToWorldSystem(v)
    );

    const mappedMesh = new Mesh(mappedVertices, obj.mesh.triangleIndices);

    return mappedMesh;
  }
}
