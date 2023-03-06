import Car from "./Car";
import FinishLine from "./FinishLine";
import type Road from "./Road";

const width = 30;
const height = 50;

const trafficSpeed = 2;
const trafficAcceleration: number = 0.2;
const trafficFriction = 0.05;
const trafficRowStart = -200;
const trafficRowIncrement = -150;

const laneLookup = new Map<string, number[]>([
  ["10", [0]],
  ["01", [1]],
  ["001", [2]],
  ["110", [0, 1]],
  ["011", [1, 2]],
  ["101", [0, 2]],
  ["0001", [3]],
  ["0011", [2, 3]],
  ["0101", [1, 3]],
  ["0111", [1, 2, 3]],
  ["1001", [0, 3]],
  ["1101", [0, 1, 3]],
  ["1011", [0, 2, 3]],
  ["1110", [0, 1, 2]],
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
    return new Car(
      "main",
      road.getLaneCenter(lane),
      y,
      width,
      height,
      controlType,
      speed
    );
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
          "traffic",
          road.getLaneCenter(lane),
          rowY,
          30,
          50,
          "DUMMY",
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

export const generateRandomTrafficHash = (
  rows: number,
  laneCount: number
): string[] => {
  const options = [...laneLookup.keys()].filter(
    (key) => key.length <= laneCount
  );
  return Array.from({ length: rows }, (_, i) => {
    return options[Math.floor(Math.random() * options.length)];
  });
};
