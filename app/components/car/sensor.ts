import Car from "./car";
import { interpolate } from "./road";

export default class Sensor {
  private rays: Array<any>;
  private readings: Array<any>;

  constructor(
    private car: Car,
    private rayCount = 5, // number of ray sensors
    private rayLength = 150, // how long each ray is in pixels
    private raySpread = Math.PI / 2, // angle that we are going to spread these rays, 45 degrees
    private rayColor = "yellow"
  ) {
    this.rays = [];
    this.readings = [];
  }

  update(roadBorders: Array<any>, traffic: Array<Car>) {
    if (!this.car.isControlledByUser) return;

    this.loadRays();
    this.loadReadings(roadBorders, traffic);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.car.isControlledByUser) return;

    for (let i = 0; i < this.rayCount; i++) {
      let end = this.readings[i] ? this.readings[i] : this.rays[i][1];

      this.drawRay(
        ctx,
        this.rayColor,
        this.rays[i][0].x,
        this.rays[i][0].y,
        end.x,
        end.y
      );
      this.drawRay(
        ctx,
        "black",
        this.rays[i][1].x,
        this.rays[i][1].y,
        end.x,
        end.y
      );
    }
  }

  private drawRay(
    ctx: CanvasRenderingContext2D,
    color: string,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }

  private loadRays() {
    this.rays = [];

    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        interpolate(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      const start = {
        x: this.car.x,
        y: this.car.y,
      };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  private loadReadings(roadBorders: Array<any>, traffic: Array<Car>) {
    this.readings = this.rays.map((ray) =>
      this.getReading(ray, roadBorders, traffic)
    );
  }

  private getReading(ray: any, roadBorders: any[], traffic: any[]) {
    let touches = [
      ...roadBorders.flatMap(([a, b]) => getIntersection(ray[0], ray[1], a, b)),
      ...traffic.flatMap((vehicle) =>
        vehicle.shape.flatMap((a: any, i: number) =>
          getIntersection(
            ray[0],
            ray[1],
            a,
            vehicle.shape[(i + 1) % vehicle.shape.length]
          )
        )
      ),
    ].filter(Boolean);

    if (!touches.length) {
      return null;
    }

    const offsets = touches.map((touch) => touch.offset);
    const minOffset = Math.min(...offsets);
    return touches.find((touch) => touch.offset === minOffset);
  }
}

export function getIntersection(
  start: any,
  end: any,
  borderStart: any,
  borderEnd: any
) {
  const tTop =
    (borderEnd.x - borderStart.x) * (start.y - borderStart.y) -
    (borderEnd.y - borderStart.y) * (start.x - borderStart.x);
  const uTop =
    (borderStart.y - start.y) * (start.x - end.x) -
    (borderStart.x - start.x) * (start.y - end.y);
  const bottom =
    (borderEnd.y - borderStart.y) * (end.x - start.x) -
    (borderEnd.x - borderStart.x) * (end.y - start.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: interpolate(start.x, end.x, t),
        y: interpolate(start.y, end.y, t),
        offset: t,
      };
    }
  }
  return null;
}
