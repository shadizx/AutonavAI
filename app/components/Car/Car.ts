import { NeuralNetwork } from "../Network/Network";
import KeyHandler from "./KeyHandler";
import Sensor, { getIntersection } from "./Sensor";

export default class Car {
  shape: Array<any> = [];
  sensor: Sensor | undefined;
  keyHandler: KeyHandler;

  brain: NeuralNetwork | undefined;
  useAI: boolean;
  private readonly hiddenLayers = 6;
  private readonly outputLayers = 2;

  speed: number = 0;
  angle: number = 0;
  collided: boolean = false;
  collidedCarColor = "#717171";
  image: HTMLImageElement | any;

  constructor(
    public type: string,
    public x: number,
    public y: number,
    public readonly width: number,
    public readonly height: number,
    readonly controlType: string,
    public MAX_SPEED: number = 3,
    readonly STEERING = 0.03,
    readonly ACCELERATION: number = 0.2,
    readonly FRICTION = 0.05
  ) {
    this.useAI = this.controlType === "AI";
    this.keyHandler = new KeyHandler(this.controlType);
    if (this.controlType !== "DUMMY") {
      this.sensor = new Sensor(this);
      this.brain = new NeuralNetwork([
        this.sensor.rayCount,
        this.hiddenLayers,
        this.outputLayers,
      ]);
    }
    this.loadImage();
  }

  update(
    roadBorders: Array<object>,
    traffic: Array<Car>,
    shallowUpdate: boolean = false
  ) {
    if (!this.collided) {
      this.move();
      this.shape = this.createShape();
      if (!shallowUpdate) {
        this.collided = this.checkCollided(roadBorders, traffic);
      }
    }
    if (this.sensor && this.brain) {
      this.sensor.update(roadBorders, traffic);
      const offsets = this.sensor.readings.map((reading) =>
        reading === null ? 0 : 1 - reading.offset
      );
      const outputs = NeuralNetwork.feedForward(offsets, this.brain);

      this.keyHandler.forward = true;
      this.keyHandler.reverse = false;
      if (this.useAI) {
        this.keyHandler.left = outputs[0] === 1;
        this.keyHandler.right = outputs[1] === 1;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, drawSensor: boolean = false) {
    if (this.sensor && drawSensor) {
      this.sensor.draw(ctx);
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    ctx.drawImage(
      this.image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    if (!this.collided) ctx.globalCompositeOperation = "multiply";
    ctx.restore();
  }

  private move() {
    if (this.keyHandler.forward) {
      this.speed += this.ACCELERATION;
    }
    if (this.keyHandler.reverse) {
      this.speed -= this.ACCELERATION;
    }

    if (this.speed != 0) {
      const flipReverse = this.speed < 0 ? -1 : 1;
      if (this.keyHandler.left) {
        this.angle += this.STEERING * flipReverse;
      }
      if (this.keyHandler.right) {
        this.angle -= this.STEERING * flipReverse;
      }
    }

    if (this.speed > this.MAX_SPEED) {
      this.speed = this.MAX_SPEED;
    } else if (this.speed < -this.MAX_SPEED / 2) {
      this.speed = -this.MAX_SPEED / 2;
    }

    if (this.speed > 0) {
      this.speed -= this.FRICTION;
    } else if (this.speed < 0) {
      this.speed += this.FRICTION;
    }

    if (Math.abs(this.speed) < this.FRICTION) {
      this.speed = 0;
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  private createShape() {
    const points: Array<object> = [];
    const radius = Math.hypot(this.width, this.height) / 2;

    const alpha = Math.atan2(this.width, this.height);
    this.addPoint(points, this.angle - alpha, radius);
    this.addPoint(points, this.angle + alpha, radius);
    this.addPoint(points, Math.PI + this.angle - alpha, radius);
    this.addPoint(points, Math.PI + this.angle + alpha, radius);
    return points;
  }

  private addPoint(points: Array<object>, angle: number, radius: number) {
    points.push({
      x: this.x - Math.sin(angle) * radius,
      y: this.y - Math.cos(angle) * radius,
    });
  }

  private checkCollided(roadBorders: any[], traffic: Car[]) {
    return (
      roadBorders.some((border) => shapeIntersect(this.shape, border)) ||
      traffic.some((car) => shapeIntersect(this.shape, car.shape))
    );
  }

  private loadImage() {
    if (typeof window === 'undefined') return;
    this.image = document.createElement("img");
    let source = "Car";
    if (this.type !== "main") {
      source = `traffic_${Math.floor(Math.random() * 8) + 1}`;
    }
    this.image.src = `./assets/${source}.png`;
  }
}

export const shapeIntersect = (
  shape1: Array<any>,
  shape2: Array<any>
): boolean => {
  for (let i = 0; i < shape1.length; i++) {
    for (let j = 0; j < shape2.length; j++) {
      const intersection = getIntersection(
        shape1[i],
        shape1[(i + 1) % shape1.length],
        shape2[j],
        shape2[(j + 1) % shape2.length]
      );

      if (intersection) {
        return true;
      }
    }
  }
  return false;
};
