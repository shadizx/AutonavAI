import { getRandomColor } from "~/utils/Utility";
import Car from "./Car";
import FinishLine from "./FinishLine";
import Road from "./Road";

const width = 30;
const height = 50;

const trafficSpeed = 2;
const trafficAcceleration: number = 0.2;
const trafficFriction = 0.05;
const trafficRowStart = -200;
const trafficRowIncrement = -200;

const laneLookup = new Map<string, number[]>([
  ["100", [0]],
  ["010", [1]],
  ["001", [2]],
  ["110", [0, 1]],
  ["011", [1, 2]],
  ["101", [0, 2]],
]);

export const generateCars = (
  road: Road,
  n: number,
  controlType: string = "AI",
  speed: number = 3
): Car[] => {
  const lane = 1;
  const y = 0;

  return Array.from({ length: n }, (_, i) => {
    return new Car(road.getLaneCenter(lane), y, width, height, controlType, "blue", speed);
  });
};

export const generateTraffic = (trafficHash: string[], road: Road): Car[] => {
  let rowY = trafficRowStart;
  const trafficRows: Car[] = [];
  trafficHash.forEach((row) => {
    const lanes = laneLookup.get(row) as number[];
    lanes.forEach((lane) => {
      trafficRows.push(
        new Car(
          road.getLaneCenter(lane),
          rowY,
          30,
          50,
          "DUMMY",
          getRandomColor(),
          trafficSpeed
        )
      );
    });
    rowY += trafficRowIncrement;
  });
  return trafficRows;
};

export const generateFinishLine = (
  trafficRows: number,
  canvasWidth: number
): FinishLine => {
  const finishLineY = trafficRows * trafficRowIncrement + trafficRowStart;
  return new FinishLine(
    canvasWidth,
    finishLineY,
    trafficSpeed,
    trafficAcceleration,
    trafficFriction
  );
};

export const generateRandomTrafficHash = (n: number): string[] => {
  return Array.from({ length: n }, (_, i) => {
    return [...laneLookup.keys()][Math.floor(Math.random() * laneLookup.size)];
  });
};
