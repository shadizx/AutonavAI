import Car from "../Car/Car";
import {
  generateCars,
  generateFinishLine,
  generateRandomTrafficHash,
  generateTraffic,
} from "../Car/Generator";
import FinishLine from "../Car/FinishLine";
import Road from "../Car/Road";
import { NeuralNetwork } from "./Network/Network";

export default class AICarController {
  cars: Car[];
  bestCar: Car;
  road: Road;
  traffic: Array<Car>;
  finishLine: FinishLine;

  public carsCollided = 0;
  generation: number = 0;

  constructor(
    public carSpeed: number = 4,
    private carControlType: string = "AI",
    public numberOfCars: number = 150,
    private canvasWidth: number = 200,
    private readonly mutationPercent: number = 0.05,
    private trafficRows: number = 3
  ) {
    this.road = new Road(canvasWidth / 2, canvasWidth * 0.9);
    this.cars = generateCars(this.road, numberOfCars, carControlType, carSpeed);
    this.bestCar = this.cars[0];
    this.traffic = generateTraffic(
      generateRandomTrafficHash(trafficRows),
      this.road
    );
    this.finishLine = generateFinishLine(trafficRows, canvasWidth);

    if (carControlType === "AI") this.loadBrains();
  }

  loadBrains() {
    if (typeof window !== "undefined") {
      const bestBrainSoFar = localStorage.getItem("bestBrain");
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
      this.toggleMachineLearning(true);
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

  toggleMachineLearning(isRaceDone: boolean = false) {
    if (this.carControlType != "AI") return;
    const bestBrainSoFar = localStorage.getItem("bestBrain");
    if (!bestBrainSoFar) {
      this.save(this.bestCar);
    } else {
      const storageBestDistance = localStorage.getItem("bestBrainDistance");
      const bestDistance =
        storageBestDistance === null ? 100 : parseFloat(storageBestDistance);
      if (this.bestCar.y < bestDistance || isRaceDone) {
        console.log("saving");
        this.save(this.bestCar);
      }
    }
  }

  save = (car: Car) => {
    localStorage.setItem("bestBrain", JSON.stringify(car.brain));
    localStorage.setItem("bestBrainDistance", car.y.toString());
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

  getCarsCollided() {
    console.log(this.carsCollided);
    return this.carsCollided;
  }

  resetCars() {
    console.log("resetting");
    this.road = new Road(this.canvasWidth / 2, this.canvasWidth * 0.9);
    this.cars = generateCars(
      this.road,
      this.numberOfCars,
      this.carControlType,
      this.carSpeed
    );
    this.bestCar = this.findBestCar();
    this.traffic = generateTraffic(
      generateRandomTrafficHash(this.trafficRows),
      this.road
    );
    this.finishLine = generateFinishLine(this.trafficRows, this.canvasWidth);

    this.cars.forEach((car) => car.update(this.road.borders, this.traffic));
    this.traffic.forEach((vehicle) => vehicle.update(this.road.borders, []));
    if (this.carControlType === "AI") this.loadBrains();
    this.generation += 1;
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
