import { Shape } from "./Shape.js";

export class ShapeStorage {
  constructor(onShapeClick) {
    this.unusedShapes = [];
    this.onShapeClick = onShapeClick;
  }

  takeShape() {
    let shape = this.unusedShapes.pop();

    if (!shape) {
      shape = new Shape();
      shape.view.eventMode = "static";
      shape.view.cursor = "pointer";
      shape.view.on("pointerdown", (e) => {
        e.stopPropagation();
        this.onShapeClick(shape);
      });
    }

    return shape;
  }

  putBackShape(shape) {
    this.unusedShapes.push(shape);
  }
}
