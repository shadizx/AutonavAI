import KeyHandler from "./key-handler";
import Sensor, { getIntersection } from "./sensor";

export default class Car {
  shape: Array<any> = [];
  sensor: Sensor;
  keyHandler: KeyHandler;

  speed: number = 0;
  angle: number = 0;
  collided: boolean = false;

  constructor(
    public x: number,
    public y: number,
    private width: number,
    private height: number,
    private ctx: CanvasRenderingContext2D,
    readonly isControlledByUser: boolean = false,
    readonly MAX_SPEED: number = 3,
    readonly ACCELERATION: number = 0.2,
    readonly FRICTION = 0.05,
    readonly STEERING = 0.03
  ) {
    this.sensor = new Sensor(this);
    this.keyHandler = new KeyHandler(this.isControlledByUser);
  }

  update(roadBorders: Array<object>, traffic: Array<Car>) {
    if (!this.collided) {
      this.move();
      this.shape = this.createShape();
      this.collided = this.checkCollided(roadBorders, traffic);
    }
    this.sensor.update(roadBorders, traffic);
  }

  draw(carColor: string = "black") {
    this.ctx.fillStyle = this.collided ? "red" : carColor;

    this.ctx.beginPath();
    this.ctx.moveTo(this.shape[0].x, this.shape[0].y);

    this.shape.forEach((point, index) => {
      if (index > 0) {
        this.ctx.lineTo(point.x, point.y);
      }
    });
    this.ctx.fill();

    this.sensor.draw(this.ctx);
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

    // based on unit circle, scale speed by value of sepeed as well
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
}

export function shapeIntersect(
  shape1: Array<any>,
  shape2: Array<any>
): boolean {
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
}
