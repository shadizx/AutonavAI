import { getRandomColor } from "~/utils/Utility";
import Car from "./Car";
import Road from "./Road";

const width = 30;
const height = 50;

const laneLookup: { [row: string]: number | number[] } = {
  "100": 0,
  "010": 1,
  "001": 2,
  "110": [0, 1],
  "011": [1, 2],
  "101": [0, 2],
};

export const generateCars = (
  road: Road,
  n: number,
  controlType: string = "AI"
): Car[] => {
  const lane = 1;
  const speed = 100;

  return Array.from({ length: n }, (_, i) => {
    return new Car(road.getLaneCenter(lane), speed, width, height, controlType, i);
  });
};

export const generateTrafficRows = (
  trafficHash: string[],
  road: Road,
  startingRow = -100,
  rowIncrement = 200
): Car[] => {
  let rowY = startingRow;
  const trafficRows: Car[] = [];
  trafficHash.forEach((row) => {
    const lanes = laneLookup[row];
    if (Array.isArray(lanes)) {
      lanes.forEach((lane) => {
        trafficRows.push(
          new Car(
            road.getLaneCenter(lane),
            rowY,
            30,
            50,
            "DUMMY",
            -1,
            getRandomColor(),
            2
          )
        );
      });
    } else {
      trafficRows.push(
        new Car(
          road.getLaneCenter(lanes),
          rowY,
          30,
          50,
          "DUMMY",
          -1,
          getRandomColor(),
          2
        )
      );
    }
    rowY -= rowIncrement;
  });
  return trafficRows;
};
