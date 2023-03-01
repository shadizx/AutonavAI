import Car from "../Car/Car";
import {
  generateFinishLine,
  generateRandomTrafficHash,
  generateTraffic,
} from "../Car/Generator";
import FinishLine from "../Car/FinishLine";
import Road from "../Car/Road";

export default class CarController {
  car: Car;
  road: Road;
  traffic: Car[];
  finishLine: FinishLine;

  trafficRows: number = 4;
  laneCount: number = 0;

  private updatedLaneCount: number;
  private updatedTrafficRows: number;

  constructor(
    private carSpeed: number = 5,
    trafficRows: number = 4,
    laneCount: number = 3,
    private canvasWidth: number = 200
  ) {
    this.loadLocalStorageOptions(carSpeed, trafficRows, laneCount);
    this.road = new Road(canvasWidth / 2, canvasWidth * 0.9, this.laneCount);
    this.car = new Car(
      this.road.getLaneCenter(1),
      0,
      30,
      50,
      "KEYS",
      "blue",
      this.carSpeed,
      0.04
    );
    this.traffic = generateTraffic(
      generateRandomTrafficHash(this.trafficRows, this.laneCount),
      this.road
    );
    this.finishLine = generateFinishLine(this.trafficRows, canvasWidth);
    this.updatedLaneCount = this.laneCount;
    this.updatedTrafficRows = this.trafficRows;
  }

  updateFinishline() {
    this.finishLine.update();
    if (this.finishLine.y - this.car.height / 2 > this.car.y) {
      this.reset();
    }
  }

  updateCar() {
    this.car.update(this.road.borders, this.traffic);
    if (this.car.collided) {
      this.reset();
    }
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

  updateCarSpeed(speed: number) {
    this.carSpeed = speed;
  }

  updateTrafficRows(rows: number) {
    this.updatedTrafficRows = rows;
  }

  updateLaneCount(lanes: number) {
    this.updatedLaneCount = lanes;
  }

  getLocalStorageOption(controlOption: string, defaultOption: number): number {
    if (typeof window === "undefined") return defaultOption;
    const option = localStorage.getItem(controlOption);
    return option ? parseFloat(option) : defaultOption;
  }

  loadLocalStorageOptions(
    carSpeed: number,
    trafficRows: number,
    laneCount: number
  ) {
    this.trafficRows = this.getLocalStorageOption("trafficRows", trafficRows);
    this.laneCount = this.getLocalStorageOption("laneCount", laneCount);
  }

  carRelativePosition(car: Car): number {
    const distance = Math.abs(car.y) - Math.abs(this.car.y);
    return distance < -300 ? -1 : distance < 600 ? 0 : 1;
  }

  reset() {
    this.laneCount = this.updatedLaneCount;
    this.trafficRows = this.updatedTrafficRows;
    this.road = new Road(
      this.canvasWidth / 2,
      this.canvasWidth * 0.9,
      this.laneCount
    );
    this.car = new Car(
      this.road.getLaneCenter(1),
      0,
      30,
      50,
      "KEYS",
      "blue",
      this.carSpeed
    );
    this.traffic = generateTraffic(
      generateRandomTrafficHash(this.trafficRows, this.laneCount),
      this.road
    );
    this.finishLine = generateFinishLine(this.trafficRows, this.canvasWidth);

    this.car.update(this.road.borders, this.traffic);
    this.traffic.forEach((vehicle) => vehicle.update(this.road.borders, []));
  }

  update() {
    this.updateCar();
    this.updateTraffic();
    this.updateFinishline();
    return this.car;
  }
}
