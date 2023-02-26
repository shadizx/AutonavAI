import { NeuralNetwork } from "../Network/Network";
import KeyHandler from "./KeyHandler";
import Sensor, { getIntersection } from "./Sensor";

export default class Car {
  shape: Array<any> = [];
  sensor: Sensor | undefined;
  keyHandler: KeyHandler;
  // for neural net car
  brain: NeuralNetwork | undefined;
  useAI: boolean;
  private readonly hiddenLayers = 6;
  private readonly outputLayers = 2;
  // for neural net car

  speed: number = 0;
  angle: number = 0;
  collided: boolean = false;
  collidedCarColor = "#717171";
  image: HTMLImageElement | any;
  mask: HTMLCanvasElement | any;

  constructor(
    public x: number,
    public y: number,
    public readonly width: number,
    public readonly height: number,
    readonly controlType: string,
    private color: string = "blue",
    public MAX_SPEED: number = 3,
    readonly STEERING = 0.03,
    readonly ACCELERATION: number = 0.2,
    readonly FRICTION = 0.05,
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
    if (typeof window !== "undefined") {
      this.loadImageAndMask();
    }
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

    if (!this.collided) {
      ctx.drawImage(
        this.mask,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
      ctx.globalCompositeOperation = "multiply";
    }
    ctx.drawImage(
      this.image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
  }

  private move() {
    if (this.keyHandler.forward) {
      this.speed += this.ACCELERATION;
    }
    if (this.keyHandler.reverse) {
      this.speed -= this.ACCELERATION;
    }

    // only be able to turn if not stopped
    if (this.speed != 0) {
      const flipReverse = this.speed < 0 ? -1 : 1;
      if (this.keyHandler.left) {
        this.angle += this.STEERING * flipReverse;
      }
      if (this.keyHandler.right) {
        this.angle -= this.STEERING * flipReverse;
      }
    }

    // cap speed to not go above MAX_SPEED in forward and below MAX_SPEED / 2 in reverse
    if (this.speed > this.MAX_SPEED) {
      this.speed = this.MAX_SPEED;
    } else if (this.speed < -this.MAX_SPEED / 2) {
      this.speed = -this.MAX_SPEED / 2;
    }

    // add friction when car is going forward/backward
    if (this.speed > 0) {
      this.speed -= this.FRICTION;
    } else if (this.speed < 0) {
      this.speed += this.FRICTION;
    }

    // stop car if speed is close to 0
    if (Math.abs(this.speed) < this.FRICTION) {
      this.speed = 0;
    }

    // based on unit circle, scale speed by value of speed as well
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
      roadBorders.some((boarder) => shapeIntersect(this.shape, boarder)) ||
      traffic.some((car) => shapeIntersect(this.shape, car.shape))
    );
  }

  private loadImageAndMask() {
    this.image = document.createElement("img");
    this.image.src = "./assets/Car.png";

    this.mask = document.createElement("canvas");
    this.mask.width = this.width;
    this.mask.height = this.height;

    const maskCtx = this.mask.getContext("2d");
    this.image.onload = () => {
      maskCtx.fillStyle = this.color;
      maskCtx.rect(0, 0, this.width, this.height);
      maskCtx.fill();

      maskCtx.globalCompositeOperation = "destination-atop";
      maskCtx.drawImage(this.image, 0, 0, this.width, this.height);
    };
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
