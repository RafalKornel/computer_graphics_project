import { FramerateCounter } from "./FramerateCounter";

type BaseRendererParams = {
  logFramerate?: boolean;
  width?: number;
  height?: number;
};

export abstract class BaseRenderEngine {
  private ctx: CanvasRenderingContext2D;

  private raf: number | undefined;

  protected width: number;
  protected height: number;

  protected buffer: Uint8ClampedArray;

  private framerateCounter?: FramerateCounter;

  /** Main entry point to renderer - implement this in children classes, by
   * modifying buffer property.
   */
  abstract loop(): void;

  constructor(
    canvas: HTMLCanvasElement,
    controlButton?: HTMLButtonElement,
    options: BaseRendererParams = {}
  ) {
    const { height = 640, width = 640, logFramerate = false } = options;

    if (logFramerate) {
      this.framerateCounter = new FramerateCounter();
    }

    this.height = height;
    this.width = width;

    canvas.width = this.width;
    canvas.height = this.height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Your browser doesn't support canvas");
    }

    this.ctx = ctx;

    this.buffer = new Uint8ClampedArray(this.width * this.height * 4);

    if (controlButton) {
      this.registerControlButton(controlButton);
    }
  }

  public start() {
    this.loopWrapper();
  }

  private loopWrapper() {
    this.framerateCounter?.incrementFrames();

    this.loop();

    this.draw();

    this.raf = requestAnimationFrame(() => this.loopWrapper());
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const imageData = new ImageData(this.buffer, this.width, this.height);

    this.ctx.putImageData(imageData, 0, 0);
  }

  private registerControlButton(button: HTMLButtonElement) {
    button.innerHTML = "pause";

    button.addEventListener("click", () => {
      if (this.raf) {
        cancelAnimationFrame(this.raf);
        this.raf = undefined;

        button.innerHTML = "start";
      } else {
        this.start();

        button.innerHTML = "pause";
      }
    });
  }
}
