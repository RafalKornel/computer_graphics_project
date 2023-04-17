import { Entity, EntityParams } from "./Entity";
import { scale } from "./vector";

enum TranslationDirections {
  Forward = "w",
  Backward = "s",
  Left = "a",
  Right = "d",
}

enum RotationDirections {
  Left = "ArrowLeft",
  Right = "ArrowRight",
  Up = "ArrowUp",
  Down = "ArrowDown",
}

/** Class responsible for controlling entities via user input */
export class ControlledEntity extends Entity {
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