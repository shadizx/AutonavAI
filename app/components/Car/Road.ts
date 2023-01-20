import { interpolate } from "~/utils/Utility";

export default class Road {
  borders: Array<object> = [];

  private readonly left: number;
  private readonly right: number;

  private readonly infinity = 1000000;
  private readonly top = -this.infinity;
  private readonly bottom = this.infinity;

  constructor(
    private x: number,
    private width: number,
    private ctx: CanvasRenderingContext2D,
    private readonly laneCount: number = 3
  ) {
    this.left = this.x - this.width / 2;
    this.right = this.x + this.width / 2;
    this.loadBorders();
  }

  draw() {
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = "white";

    for (let i = 1; i <= this.laneCount - 1; i++) {
      const x = interpolate(this.left, this.right, i / this.laneCount);
      this.drawLine(x, this.top, x, this.bottom, 20);
    }

    this.ctx.setLineDash([]);
    this.borders.forEach((border: any) => {
      this.drawLine(border[0].x, border[0].y, border[1].x, border[1].y);
    });
  }

  drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    dashLength: number = 0
  ) {
    dashLength != 0
      ? this.ctx.setLineDash([dashLength, dashLength])
      : this.ctx.setLineDash([]);

    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  getLaneCenter(laneIndex: number) {
    const laneWidth = this.width / this.laneCount;
    return (
      this.left +
      laneWidth / 2 +
      Math.min(laneIndex, this.laneCount - 1) * laneWidth
    );
  }

  // load the list of line borders
  loadBorders() {
    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };

    this.borders = [
      [bottomLeft, topLeft],
      [bottomRight, topRight],
    ];
  }
}
