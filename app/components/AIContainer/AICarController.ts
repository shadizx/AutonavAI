import Car from "../Car/Car";
import {
  defaultTrafficRows,
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

  carsCollided = 0;
  generation: number = 0;

  constructor(
    private carControlType: string = "AI",
    private numberOfCars: number = 100,
    private canvasWidth: number = 200,
    private readonly mutationPercent: number = 0.01,
    private trafficRows: string[] = generateRandomTrafficHash(10)
  ) {
    this.road = new Road(canvasWidth / 2, canvasWidth * 0.9);
    this.cars = generateCars(this.road, numberOfCars, carControlType);
    this.bestCar = this.cars[0];
    this.traffic = generateTraffic(trafficRows, this.road);
    this.finishLine = generateFinishLine(this.trafficRows.length, canvasWidth);

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
    this.cars = this.cars.filter((car) => car.y - this.bestCar.y <= 300);
    this.carsCollided = 0;
    for (let i = this.cars.length - 1; i >= 0; i--) {
      let car = this.cars[i];
      this.carsCollided += car.collided ? 1 : 0;
      car.update(this.road.borders, this.traffic);
    }
    if (this.carsCollided === this.cars.length) {
      this.toggleMachineLearning();
      this.resetCars();
    }
  }

  updateTraffic() {
    this.traffic = this.traffic
      .filter((car) => car.y - this.bestCar.y < 300)
      .map((car) => {
        car.update(this.road.borders, []);
        return car;
      });
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

  resetCars() {
    console.log("resetting");
    this.road = new Road(this.canvasWidth / 2, this.canvasWidth * 0.9);
    this.cars = generateCars(this.road, this.numberOfCars, this.carControlType);
    this.bestCar = this.findBestCar();
    this.traffic = generateTraffic(this.trafficRows, this.road);
    this.finishLine = generateFinishLine(
      this.trafficRows.length,
      this.canvasWidth
    );

    this.cars.forEach((car) => car.update(this.road.borders, this.traffic));
    this.traffic.forEach((vehicle) => vehicle.update(this.road.borders, []));
    if (this.carControlType === "AI") this.loadBrains();
    this.generation += 1;
  }

  update() {
    this.updateCars();
    this.bestCar = this.findBestCar();
    this.updateTraffic();
    this.updateFinishline();
    return this.bestCar;
  }
}
