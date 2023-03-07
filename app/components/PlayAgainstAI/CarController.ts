import { generateFinishLine, generateTraffic } from "../Car/Generator";
import Car from "../Car/Car";
import Road from "../Car/Road";
import type FinishLine from "../Car/FinishLine";

export default class CarController {
  car: Car;
  road: Road;
  traffic: Car[];
  finishLine: FinishLine;

  canvasWidth: number = 200;
  result: number = 0;

  constructor(
    private carSpeed: number = 5,
    public trafficRows: number = 4,
    public laneCount: number = 3,
    gameTrafficHash: string[]
  ) {
    this.road = new Road(
      this.canvasWidth / 2,
      this.canvasWidth * 0.9,
      this.laneCount
    );
    this.car = new Car(
      "main",
      this.road.getLaneCenter(1),
      0,
      30,
      50,
      "KEYS",
      this.carSpeed,
      0.055
    );
    this.traffic = generateTraffic(gameTrafficHash, this.road, true);
    this.finishLine = generateFinishLine(this.trafficRows, this.canvasWidth);
  }

  updateFinishline() {
    this.finishLine.update();
    if (this.finishLine.y - this.car.height / 2 > this.car.y) {
      this.result = 1;
    }
  }

  updateCar() {
    this.car.update(this.road.borders, this.traffic);
    if (this.car.collided) this.result = -1;
  }

  updateTraffic() {
    this.traffic = this.traffic.filter((car) => {
      const pos = this.carRelativePosition(car);
      if (pos === 0 || pos === 1) {
        car.update(this.road.borders, [], pos === 1);
        return true;
      }
      return false;
    });
  }

  carRelativePosition(car: Car): number {
    const distance = Math.abs(car.y) - Math.abs(this.car.y);
    return distance < -300 ? -1 : distance < 600 ? 0 : 1;
  }

  update() {
    this.updateCar();
    this.updateTraffic();
    this.updateFinishline();
    return this.car;
  }
}
