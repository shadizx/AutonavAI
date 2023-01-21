import { useEffect, useRef, useState } from "react";
import Car, { generateAICars } from "../Car/Car";
import Road from "../Car/Road";
import { NeuralNetwork } from "./Network/Network";

interface AICarUIProps {
  setCar: any;
}

export default function AICarUI({ setCar }: AICarUIProps) {
  const [bestBrain, setBestBrain] = useState(new NeuralNetwork([0]));

  const canvasRef = useRef(null);
  const numberOfCars = 100;
  const mutationPercent = 0.2;
  const trafficColor = "red";
  const parallelCarColors = "#244FFC";

  let canvas = canvasRef.current as any;
  let ctx: CanvasRenderingContext2D;

  let cars: Car[];
  let bestCar: Car;
  let road: Road;
  let traffic: Array<Car>;

  useEffect(() => {
    canvas = canvasRef.current as any;
    canvas.width = 200;

    ctx = canvas.getContext("2d");
    road = new Road(canvas.width / 2, canvas.width * 0.9, ctx);
    cars = generateAICars(road, numberOfCars, ctx);
    bestCar = cars[0];

    const bestBrainSoFar = localStorage.getItem("bestBrain");
    if (bestBrainSoFar) {
      for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(bestBrainSoFar);
        if (i != 0) {
          NeuralNetwork.mutate(cars[i].brain, mutationPercent);
        }
      }
    }

    traffic = [
      new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
      new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
    ];

    animate();
  }, []);

  const animate = () => {
    traffic.forEach((vehicle) => vehicle.update(road.borders, []));
    cars.forEach((car) => car.update(road.borders, traffic));

    canvas.height = window.innerHeight;

    bestCar = findBestCar(cars);
    setCar(bestCar);
    setBestBrain(bestCar.brain as NeuralNetwork);

    ctx.save();
    ctx.translate(0, -bestCar.y + canvas.height * 0.7);
    road.draw();

    traffic.forEach((vehicle) => vehicle.draw(ctx, trafficColor));

    ctx.globalAlpha = 0.2;
    cars.forEach((car) => car.draw(ctx, parallelCarColors));

    ctx.globalAlpha = 1;
    bestCar.draw(ctx, "blue", true);

    ctx.restore();
    requestAnimationFrame(animate);
  };

  // TODO: replace with backend storage in the end
  const save = () => {
    console.log("saving car");
    console.log(bestBrain);
    // localStorage.setItem("bestBrain", JSON.stringify(bestBrain));
  };

  const discard = () => {
    console.log("deleting bestbrain");
    localStorage.removeItem("bestBrain");
  };

  return (
    <div className="flex">
      <canvas
        id="carCanvas"
        className="bg-slate-400"
        ref={canvasRef}
        onLoad={() => setCar(bestCar)}
      ></canvas>
      <div id="AICarUIbuttons" className="h-max self-center">
        <button
          id="saveButton"
          className="bg-blue-500 hover:bg-blue-700 py-1 px-2 m-2 rounded"
          onClick={save}
        >
          💾
        </button>
        <button
          id="deleteButton"
          className="bg-red-500 hover:bg-red-700 py-1 px-2 m-2 rounded"
          onClick={() => discard()}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

// fitness function for genetic algorithm machine learning.
const findBestCar = (cars: Car[]) => {
  return cars.reduce((highest: Car, car: Car) =>
    car.y < highest.y ? car : highest
  );
};
