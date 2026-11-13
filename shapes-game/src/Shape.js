import { Graphics } from "pixi.js";
import { GAME_HEIGHT, SHAPE_TYPES } from "./config.js";
import { polygonPoints } from "./utils.js";

export class Shape {
  constructor() {
    this.view = new Graphics();
  }

  init(x, y, size) {
    this.size = size;
    this.speed = 0;
    this.color = Math.random() * 0xffffff;
    this.type = SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)];

    this.view.clear();
    this.area = 0;

    switch (this.type.shape) {
      case "square":
        this.view.rect(0, 0, size, size);
        this.area = size * size;
        break;
      case "circle":
        this.view.circle(size / 2, size / 2, size / 2);
        this.area = Math.PI * (size / 2) * (size / 2);
        break;
      case "ellipse":
        this.view.ellipse(size / 2, size / 2, size / 2, size / 3);
        this.area = Math.PI * (size / 2) * (size / 3);
        break;
      case "star":
        this.view.star(size / 2, size / 2, 5, size / 2, size / 4);
        this.area = 5 * (size / 2) * (size / 4) * Math.sin(Math.PI / 5);
        break;
      default: {
        const n = this.type.sides;
        const r = size / 2;
        this.view.poly(polygonPoints(n, size));
        this.area = (n / 2) * r * r * Math.sin((2 * Math.PI) / n);
        break;
      }
    }

    this.view.fill(this.color);
    this.view.x = x;
    this.view.y = y;
  }

  fall(gravity, deltaTime) {
    this.speed = this.speed + gravity * deltaTime;
    this.view.y = this.view.y + this.speed * deltaTime;
  }

  isVisible() {
    const top = this.view.y;
    const bottom = this.view.y + this.size;
    return bottom > 0 && top < GAME_HEIGHT;
  }

  isOutside() {
    return this.view.y > GAME_HEIGHT;
  }

  visibleArea() {
    const top = this.view.y;
    const bottom = this.view.y + this.size;

    const visibleTop = Math.max(top, 0);
    const visibleBottom = Math.min(bottom, GAME_HEIGHT);

    if (visibleBottom <= visibleTop) {
      return 0;
    }

    const fraction = (visibleBottom - visibleTop) / this.size;
    return this.area * fraction;
  }
}
