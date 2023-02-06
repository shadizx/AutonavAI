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
    public laneCount: number = 3
  ) {
    this.left = this.x - this.width / 2;
    this.right = this.x + this.width / 2;
    this.loadBorders();
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    for (let i = 1; i <= this.laneCount - 1; i++) {
      const x = interpolate(this.left, this.right, i / this.laneCount);
      this.drawLine(ctx, x, this.top, x, this.bottom, 20);
    }

    ctx.setLineDash([]);
    this.borders.forEach((border: any) => {
      this.drawLine(ctx, border[0].x, border[0].y, border[1].x, border[1].y);
    });
  }

  drawLine(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    dashLength: number = 0
  ) {
    dashLength != 0
      ? ctx.setLineDash([dashLength, dashLength])
      : ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
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
