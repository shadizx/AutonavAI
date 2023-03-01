import AICarController from "../AICarController";
import CarController from "./CarController";

export default class Game {
  constructor(
    public ai: AICarController,
    public user: CarController,
    public setAIController: Function,
    public setUserController: Function,
    public active: boolean = false
  ) {}
}
