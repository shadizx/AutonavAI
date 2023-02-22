import Car from "./Car/Car";
import {
  generateCars,
  generateFinishLine,
  generateRandomTrafficHash,
  generateTraffic,
} from "./Car/Generator";
import FinishLine from "./Car/FinishLine";
import Road from "./Car/Road";
import { NeuralNetwork } from "./Network/Network";

export default class AICarController {
  cars: Car[];
  bestCar: Car;
  road: Road;
  traffic: Array<Car>;
  finishLine: FinishLine;

  carSpeed: number = 0;
  mutationPercent: number = 0;
  trafficRows: number = 0;
  laneCount: number = 0;

  carsCollided = 0;

  private updatedLaneCount: number;
  private updatedMutationPercent: number;
  private updatedTrafficRows: number;

  constructor(
    carSpeed: number = 3,
    mutationPercent: number = 0.03,
    trafficRows: number = 3,
    laneCount: number = 3,
    private carControlType: string = "AI",
    public numberOfCars: number = 150,
    private canvasWidth: number = 200
  ) {
    this.loadLocalStorageOptions(
      carSpeed,
      mutationPercent,
      trafficRows,
      laneCount
    );
    this.road = new Road(canvasWidth / 2, canvasWidth * 0.9, this.laneCount);
    this.cars = generateCars(this.road, numberOfCars, carControlType, carSpeed);
    this.bestCar = this.cars[0];
    this.traffic = generateTraffic(
      generateRandomTrafficHash(this.trafficRows, this.laneCount),
      this.road
    );
    this.finishLine = generateFinishLine(this.trafficRows, canvasWidth);

    this.updatedLaneCount = this.laneCount;
    this.updatedMutationPercent = this.mutationPercent;
    this.updatedTrafficRows = this.trafficRows;
    if (carControlType === "AI") this.loadBrains();
  }

  loadBrains() {
    if (typeof window !== "undefined") {
      const bestBrainSoFar = localStorage.getItem(
        "bestBrain" + this.laneCount.toString()
      );
      if (bestBrainSoFar) {
        for (let i = 0; i < this.cars.length; i++) {
          this.cars[i].brain = JSON.parse(bestBrainSoFar);
          if (i != 0) {
            NeuralNetwork.mutate(this.cars[i].brain, this.mutationPercent);
          }
        }
      }
    }
  }

  updateFinishline() {
    this.finishLine.update();
    if (this.finishLine.y - this.bestCar.height / 2 > this.bestCar.y) {
      this.toggleMachineLearning();
      this.resetCars();
    }
  }

  updateCars() {
    this.cars = this.cars.filter((car) => {
      car.MAX_SPEED = this.carSpeed;
      let carCollided = car.collided;
      car.update(this.road.borders, this.traffic);
      const pos = this.carRelativePosition(car);

      let carJustCollided = carCollided !== car.collided;
      if (carJustCollided) {
        this.carsCollided += 1;
      }

      return pos !== -1 || !car.collided;
    });
    if (this.carsCollided === this.numberOfCars) {
      this.toggleMachineLearning();
      this.resetCars();
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

  updateMutationPercent(percent: number) {
    this.updatedMutationPercent = percent;
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
    mutationPercent: number,
    trafficRows: number,
    laneCount: number
  ) {
    this.carSpeed = this.getLocalStorageOption("carSpeed", carSpeed);
    this.mutationPercent = this.getLocalStorageOption(
      "mutationPercent",
      mutationPercent
    );
    this.trafficRows = this.getLocalStorageOption("trafficRows", trafficRows);
    this.laneCount = this.getLocalStorageOption("laneCount", laneCount);
  }

  toggleMachineLearning() {
    if (this.carControlType != "AI") return;
    const bestBrainSoFar = localStorage.getItem(
      "bestBrain" + this.laneCount.toString()
    );
    if (!bestBrainSoFar) {
      this.save(this.bestCar);
    } else {
      const storageBestDistance = localStorage.getItem(
        "bestBrainDistance" + this.laneCount.toString()
      );
      const bestDistance =
        storageBestDistance === null ? 100 : parseFloat(storageBestDistance);
      if (this.bestCar.y < bestDistance) {
        console.log("saving");
        this.save(this.bestCar);
      }
    }
  }

  save = (car: Car) => {
    localStorage.setItem(
      "bestBrain" + this.laneCount.toString(),
      JSON.stringify(car.brain)
    );
    localStorage.setItem(
      "bestBrainDistance" + this.laneCount.toString(),
      car.y.toString()
    );
  };

  // fitness function for genetic algorithm machine learning.
  findBestCar = (cars: Car[] = this.cars): Car => {
    return cars.reduce((highest: Car, car: Car) =>
      car.y < highest.y ? car : highest
    );
  };

  carRelativePosition(car: Car): number {
    const distance = Math.abs(car.y) - Math.abs(this.bestCar.y);
    return distance < -300 ? -1 : distance < 600 ? 0 : 1;
  }

  resetCars() {
    console.log("resetting");
    this.laneCount = this.updatedLaneCount;
    this.mutationPercent = this.updatedMutationPercent;
    this.trafficRows = this.updatedTrafficRows;
    this.road = new Road(
      this.canvasWidth / 2,
      this.canvasWidth * 0.9,
      this.laneCount
    );
    this.cars = generateCars(
      this.road,
      this.numberOfCars,
      this.carControlType,
      this.carSpeed
    );
    this.bestCar = this.findBestCar();
    this.traffic = generateTraffic(
      generateRandomTrafficHash(this.trafficRows, this.laneCount),
      this.road
    );
    this.finishLine = generateFinishLine(this.trafficRows, this.canvasWidth);

    this.cars.forEach((car) => car.update(this.road.borders, this.traffic));
    this.traffic.forEach((vehicle) => vehicle.update(this.road.borders, []));
    if (this.carControlType === "AI") this.loadBrains();

    this.carsCollided = 0;
  }

  update() {
    this.updateCars();
    this.bestCar = this.findBestCar();
    this.updateTraffic();
    this.updateFinishline();
    return this.bestCar;
  }
}
