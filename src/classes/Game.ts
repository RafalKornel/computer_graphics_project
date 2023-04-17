import { BaseRenderEngine } from "./BaseRenderer";
import { Camera } from "./Camera";
import { CoordinateSystem } from "./CoordinateSystem";
import { Cube } from "./Cube";
import { Scene } from "./Scene";

// const DEG_45 = -Math.PI / 4;

// const COORDINATE_SYSTEM_ROTATET_BY_45_DEG = new CoordinateSystem(
//   [Math.cos(DEG_45), 0, Math.sin(DEG_45)],
//   [0, 1, 0],
//   [-Math.sin(DEG_45), 0, Math.cos(DEG_45)]
// );

const CARTESIAN = new CoordinateSystem([1, 0, 0], [0, 1, 0], [0, 0, 1]);

export class Game extends BaseRenderEngine {
  private _scene: Scene;
  private _camera: Camera;

  constructor(canvas: HTMLCanvasElement, controlButton?: HTMLButtonElement) {
    super(canvas, controlButton, {
      height: 640,
      width: 640,
      logFramerate: false,
    });

    const cubes = [
      new Cube({ dimenstion: 1, position: [1, 0, -2] }),
      new Cube({ dimenstion: 2, position: [-2, 0, -3] }),
    ];

    const scene = new Scene();

    scene.addObjects(cubes);

    this._scene = scene;

    this._camera = new Camera({
      buffer: this.buffer,
      width: this.width,
      height: this.height,
      focalDistance: 1,
      position: [0, 0, 0],
      localCoordinateSystem: CARTESIAN,
    });
  }

  loop() {
    this._scene.objects.forEach((object) => {
      object.rotateX(Math.PI / 4 / 100);
    });
    // this._camera.move([0.01, 0.005, 0.005]);

    this._camera.renderScene(this._scene);
  }
}
