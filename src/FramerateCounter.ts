// TODO: refactor counting framerate method
export class FramerateCounter {
  private framesCount: number;
  private LOG_FRAMERATE: boolean;

  private startTime: number;

  constructor() {
    this.framesCount = 0;

    this.LOG_FRAMERATE = true;

    this.startTime = performance.now();

    this.measureFramerate();
  }

  protected incrementFrames() {
    this.framesCount += 1;
  }

  private get dt() {
    const now = performance.now();

    const dt = now - this.startTime;

    return dt;
  }

  protected get framerate() {
    const framerate = (this.framesCount / this.dt) * 1000;

    return framerate;
  }

  public logFramerate() {
    const timeInS = this.dt / 1000;

    console.log(
      `Avg framerate: ${this.framerate.toFixed(2)} | frames: ${
        this.framesCount
      } | t: ${timeInS.toFixed()} `
    );
  }

  private measureFramerate() {
    if (!this.LOG_FRAMERATE) return;

    setInterval(() => this.logFramerate(), 1000);
  }
}
