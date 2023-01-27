import Car from "../Car/Car";
import { generateCars, generateTrafficRows } from "../Car/CarGenerator";
import Road from "../Car/Road";
import { NeuralNetwork } from "./Network/Network";

export default class AICarController {
  cars: Car[];
  bestCar: Car;
  road: Road;
  traffic: Array<Car>;
  carsCollided = 0;
  countdownStart = 1000;
  countdown = this.countdownStart;
  generation: number = 0;

  constructor(
    private carControlType: string = "AI",
    private numberOfCars: number = 100,
    private canvasWidth: number = 200,
    private readonly mutationPercent: number = 0.1,
    private trafficRows: string[] = ["010", "101", "110", "011"]
  ) {
    this.road = new Road(canvasWidth / 2, canvasWidth * 0.9);
    this.cars = generateCars(this.road, numberOfCars, carControlType);
    this.bestCar = this.cars[0];
    this.traffic = generateTrafficRows(trafficRows, this.road);
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

  updateCountdown() {
    this.countdown -= 1;
    if (this.countdown < 0) {
      this.toggleMachineLearning();
      this.resetCars();
    }
  }

  updateCars() {
    this.carsCollided = 0;
    this.cars.forEach((car) => {
      car.update(this.road.borders, this.traffic);
      this.carsCollided += car.collided ? 1 : 0;
      if (this.carsCollided === this.numberOfCars) {
        this.toggleMachineLearning();
        this.resetCars();
      }
    });
  }

  toggleMachineLearning() {
    if (this.carControlType != "AI") return;
    const bestBrainSoFar = localStorage.getItem("bestBrain");
    if (!bestBrainSoFar) {
      this.save(this.bestCar);
    } else {
      const storageBestDistance = localStorage.getItem("bestBrainDistance");
      const bestDistance =
        storageBestDistance === null ? 100 : parseFloat(storageBestDistance);
      if (this.bestCar.y < bestDistance) {
        this.save(this.bestCar);
      }
    }
  }

  // TODO: replace with backend storage in the end
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
    this.traffic = generateTrafficRows(this.trafficRows, this.road);

    this.cars.forEach((car) => car.update(this.road.borders, this.traffic));
    this.traffic.forEach((vehicle) => vehicle.update(this.road.borders, []));
    this.countdown = this.countdownStart;
    if (this.carControlType === "AI") this.loadBrains();
    this.generation += 1;
  }

  update() {
    this.updateCountdown();
    this.updateCars();
    this.bestCar = this.findBestCar();
    this.traffic.forEach((vehicle) => vehicle.update(this.road.borders, []));
    return this.bestCar;
  }
}
