import { BaseRenderEngine } from "./BaseRenderer";
import { Camera } from "./Camera";
import { CoordinateSystem } from "./CoordinateSystem";
import { Cube } from "./Cube";
import { Scene } from "./Scene";

const DEG_45 = -Math.PI / 4;

const COORDINATE_SYSTEM_ROTATET_BY_45_DEG = new CoordinateSystem(
  [Math.cos(DEG_45), 0, Math.sin(DEG_45)],
  [0, 1, 0],
  [-Math.sin(DEG_45), 0, Math.cos(DEG_45)]
);

const CARTESIAN = new CoordinateSystem([1, 0, 0], [0, 1, 0], [0, 0, 1]);

export class Game extends BaseRenderEngine {
  private scene: Scene;
  private camera: Camera;

  constructor(canvas: HTMLCanvasElement, controlButton?: HTMLButtonElement) {
    super(canvas, controlButton);

    const cube = new Cube({ dimenstion: 1, position: [0, 0, -1] });

    console.log({ cube });

    const scene = new Scene();

    scene.addObject(cube);

    this.scene = scene;

    this.camera = new Camera({
      aspectRatio: 1,
      focalDistance: 1,
      position: [0, 0, 0],
      localCoordinateSystem: CARTESIAN,
    });
  }

  loop() {
    this.scene.objects[0].rotateX(Math.PI / 4 / 100);
    // this.camera.move([0.01, 0.005, 0.005]);

    this.camera.renderScene(this.buffer, {
      scene: this.scene,
      height: this.height,
      width: this.width,
    });
  }
}
