import AICarController from "../AICarController";
import { generateRandomTrafficHash } from "../Car/Generator";
import CarController from "./CarController";

export default class Game {
  ai: AICarController;
  user: CarController;

  aiScore = 0;
  userScore = 0;
  trafficHash: string[];

  trafficRows = 10;
  laneCount = 4;
  carSpeed = 4;
  canvasWidth = 200;

  constructor(public active: boolean = false) {
    this.trafficHash = generateRandomTrafficHash(
      this.trafficRows,
      this.laneCount
    );
    this.ai = new AICarController(
      this.carSpeed,
      this.trafficRows,
      this.laneCount,
      this.trafficHash
    );
    this.user = new CarController(
      this.carSpeed,
      this.trafficRows,
      this.laneCount,
      this.trafficHash
    );
  }
}
