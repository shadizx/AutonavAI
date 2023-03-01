import AICarController from "../AICarController";
import KeyHandler from "../Car/KeyHandler";
import CarController from "./CarController";

export default class Game {
  constructor(
    public ai: AICarController,
    public user: CarController,
    public setAIController: Function,
    public setUserController: Function,
    public active: boolean = false
  ) {
    user.car.keyHandler = new KeyHandler("KEYS");
  }
}
