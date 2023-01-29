export default class FinishLine {
  xStart: number = 0;
  xEnd: number = 0;
  speed: number = 0;
  width: number = 0;

  constructor(
    private canvasWidth: number,
    public y: number,
    private maxSpeed: number,
    private acceleration: number,
    private friction: number,
    private thickness: number = 10,
    private color: string = "#22C55E"
  ) {
    const x = this.canvasWidth / 2;
    this.width = this.canvasWidth * 0.9 - 6;

    this.xStart = x - this.width / 2;
    this.xEnd = x + this.width / 2;
  }

  update() {
    this.speed += this.acceleration;
    if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
    if (this.speed > 0) this.speed -= this.friction;
    this.y -= this.speed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.xStart, this.y);
    ctx.lineTo(this.xEnd, this.y);
    ctx.lineWidth = this.thickness;
    ctx.strokeStyle = this.color;
    ctx.stroke();
  }
}
