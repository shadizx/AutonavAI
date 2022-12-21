import KeyHandler from "./key-handler";

export default class Car {
  keyHandler: KeyHandler;

  speed: number = 0;
  angle: number = 0;

  constructor(
    private x: number,
    private y: number,
    private width: number,
    private height: number,
    private ctx: any,
    readonly ACCELERATION: number = 0.2,
    readonly MAX_SPEED: number = 3,
    readonly FRICTION = 0.05,
    readonly STEERING = 0.03
  ) {
    this.keyHandler = new KeyHandler();
  }

  update() {
    this.move();
  }

  draw() {
    this.ctx.save();
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(-this.angle);

    this.ctx.beginPath();
    this.ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    this.ctx.fill();

    this.ctx.restore();
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
}
