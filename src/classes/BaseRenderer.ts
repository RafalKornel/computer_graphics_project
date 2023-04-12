import { FramerateCounter } from "./FramerateCounter";

export abstract class BaseRenderEngine extends FramerateCounter {
  private ctx: CanvasRenderingContext2D;

  private raf: number | undefined;

  protected width: number;
  protected height: number;

  protected buffer: Uint8ClampedArray;

  /** Main entry point to renderer - implement this in children classes, by
   * modifying buffer property.
   */
  abstract loop(): void;

  constructor(
    canvas: HTMLCanvasElement,
    controlButton?: HTMLButtonElement,
    logFramerate?: boolean
  ) {
    super(logFramerate);

    this.height = 640;
    this.width = 640;

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
    this.incrementFrames();

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
