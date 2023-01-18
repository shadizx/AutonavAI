import { useEffect, useRef, useState } from "react";
import Car, { generateCars } from "../Car/Car";
import Road from "../Car/Road";

interface AICarUIProps {
  setCar: any;
}

export default function AICarUI({ setCar }: AICarUIProps) {
  const [bestCarState, setBestCarState] = useState(
    new Car(0, 0, 0, 0, null, "")
  );

  const canvasRef = useRef(null);
  let canvas = canvasRef.current as any;
  let ctx: CanvasRenderingContext2D;

  const numberOfCars = 100;
  let cars: Car[] | any = null;
  let bestCar: Car | any = null;
  let road: Road;
  let traffic: Array<Car>;
  const trafficColor = "red";
  const parallelCarColors = "#244FFC";

  useEffect(() => {
    canvas = canvasRef.current as any;
    canvas.width = 200;

    ctx = canvas.getContext("2d");
    road = new Road(canvas.width / 2, canvas.width * 0.9, ctx);
    cars = generateCars(road, numberOfCars, ctx);
    bestCar = cars[0];
    const bestLocalStorageBrain = localStorage.getItem("bestBrain");
    if (bestLocalStorageBrain) {
      bestCar.brain = JSON.parse(bestLocalStorageBrain);
    }
    traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, ctx, "DUMMY", 2)];
    animate();
  }, []);

  const animate = () => {
    for (let vehicle of traffic) {
      vehicle.update(road.borders, []);
    }
    for (let car of cars) {
      car.update(road.borders, traffic);
    }
    canvas.height = window.innerHeight;

    bestCar = findBestCar(cars);
    setBestCarState(bestCar);

    ctx.save();
    ctx.translate(0, -bestCar.y + canvas.height * 0.7);
    road.draw();

    traffic.forEach((vehicle) => {
      vehicle.draw(trafficColor);
    });

    ctx.globalAlpha = 0.2;
    for (let i = 1; i < cars.length; i++) {
      cars[i].draw(parallelCarColors);
    }
    ctx.globalAlpha = 1;
    bestCar.draw("blue", true);

    setCar(bestCar);
    requestAnimationFrame(animate);
  };

  // TODO: replace with backend storage in the end
  const save = () => {
    console.log("saving car");
    console.log(bestCarState);
    localStorage.setItem("bestBrain", JSON.stringify(bestCarState.brain));
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
const findBestCar = (cars: Car[] | any) => {
  return cars.reduce((highest: Car, car: Car) =>
    car.y < highest.y ? car : highest
  );
};
