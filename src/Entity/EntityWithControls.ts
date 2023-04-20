import { scale } from "../utils/vector";
import { Entity, EntityParams } from "./Entity";

enum TranslationDirections {
  Forward = "w",
  Backward = "s",
  Left = "q",
  Right = "e",
}

enum RotationDirections {
  Left = "a",
  Right = "d",
}

/** Class responsible for controlling entities via user input */
export class EntityWithControls extends Entity {
  private TRANSLATION_INTERVAL = 0.1;
  private ROTATION_INTERVAL = 0.1;

  constructor(params: EntityParams) {
    super(params);

    this.registerMovement();
  }
  private registerMovement() {
    document.addEventListener("keydown", (e) => {
      this.handleTranslation(e.key);
      this.handleHorizontalRotation(e.key);
    });
  }

  private handleTranslation = (key: string) => {
    const forward = this.localCoordinateSystem.z;
    const right = this.localCoordinateSystem.x;

    if (key === TranslationDirections.Forward) {
      this.move(scale(forward, this.TRANSLATION_INTERVAL));
    }

    if (key === TranslationDirections.Backward) {
      this.move(scale(forward, -this.TRANSLATION_INTERVAL));
    }

    if (key === TranslationDirections.Left) {
      this.move(scale(right, -this.TRANSLATION_INTERVAL));
    }

    if (key === TranslationDirections.Right) {
      this.move(scale(right, this.TRANSLATION_INTERVAL));
    }
  };

  private handleHorizontalRotation(key: string) {
    if (key === RotationDirections.Left) {
      this.rotateY(this.ROTATION_INTERVAL);
    }

    if (key === RotationDirections.Right) {
      this.rotateY(-this.ROTATION_INTERVAL);
    }
  }
}
