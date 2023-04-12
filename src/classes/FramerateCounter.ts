// TODO: refactor counting framerate method
export class FramerateCounter {
  private framesCount: number;
  private _logFramerate: boolean;

  private startTime: number;

  constructor(logFramerate: boolean = false) {
    this.framesCount = 0;

    this._logFramerate = logFramerate;

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
    if (!this._logFramerate) return;

    setInterval(() => this.logFramerate(), 1000);
  }
}
