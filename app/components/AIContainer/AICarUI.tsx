import { useEffect, useRef, useState } from "react";
import Car from "../Car/Car";
import { generateCars, generateTrafficRows } from "../Car/CarGenerator";
import Road from "../Car/Road";
import { NeuralNetwork } from "./Network/Network";

interface AICarUIProps {
  setCar: any;
}

export default function AICarUI({ setCar }: AICarUIProps) {
  const [storedBestCar, setStoredBestCar] = useState(new Car(0, 0, 0, 0, ""));
  const [isSelfLearn, setSelfLearn] = useState(false);

  const canvasRef = useRef(null);
  const numberOfCars = 50;
  const mutationPercent = 0.2;

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
    road = new Road(canvas.width / 2, canvas.width * 0.9);
    cars = generateCars(road, numberOfCars);
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

    traffic = generateTrafficRows(["010", "101", "110", "011"], road);

    animate();
  }, []);

  const animate = () => {
    traffic.forEach((vehicle) => vehicle.update(road.borders, []));
    cars.forEach((car) => car.update(road.borders, traffic));

    canvas.height = window.innerHeight;

    bestCar = findBestCar(cars);
    setCar(bestCar);
    setStoredBestCar(bestCar);

    /*
      need to check if the bestCar got further than the storage bestCar 
    */
    // autoUpdateStoredBestCar();

    ctx.save();
    ctx.translate(0, -bestCar.y + canvas.height * 0.7);
    road.draw(ctx);

    traffic.forEach((vehicle) => vehicle.draw(ctx));

    ctx.globalAlpha = 0.2;
    cars.forEach((car) => car.draw(ctx));

    ctx.globalAlpha = 1;
    bestCar.draw(ctx, true);

    ctx.restore();
    requestAnimationFrame(animate);
  };

  // TODO: replace with backend storage in the end
  const save = () => {
    console.log("saving car");
    console.log(storedBestCar.brain);
    // localStorage.setItem("bestBrain", JSON.stringify(storedBestCar.brain));
    // localStorage.setItem("bestBrainDistance", storedBestCar.y)
  };

  const discard = () => {
    console.log("deleting bestbrain");
    localStorage.removeItem("bestBrain");
  };

  const handleChange = (event: any) => {
    setSelfLearn((current) => !current);
  };

  return (
    <div className="flex">
      <canvas
        id="carCanvas"
        className="bg-slate-400"
        ref={canvasRef}
        onLoad={() => setCar(bestCar)}
      ></canvas>
      <div
        id="AICarUIbuttons"
        className="flex flex-wrap self-center justify-center border-2 m-2 w-min"
      >
        <div
          id="SelfLearnContainer"
          className="flex items-center justify-center mx-2 mt-2 p-1"
        >
          <input
            type="checkbox"
            id="SelfLearnCheckbox"
            name="SelfLearnCheckbox"
            className="w-4 h-4"
            onChange={handleChange}
          />
          <label
            htmlFor="SelfLearnCheckbox"
            className="text-sm font-medium text-gray-300 px-2 min-w-max"
          >
            Self-Learn
          </label>
        </div>
        <div id="saveAndDeleteButtons" className="flex flex-nowrap mb-1">
          <button
            id="saveButton"
            className={
              "bg-blue-500 py-1 px-2 m-2 rounded " +
              (isSelfLearn ? "opacity-50 cursor-default" : "hover:bg-blue-700")
            }
            onClick={save}
          >
            💾
          </button>
          <button
            id="deleteButton"
            className={
              "bg-red-500 py-1 px-2 m-2 rounded " +
              (isSelfLearn ? "opacity-50 cursor-default" : "hover:bg-red-700")
            }
            onClick={() => discard()}
          >
            🗑️
          </button>
        </div>
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
