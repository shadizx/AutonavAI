import KeyHandler from "./key-handler";

export default class Car {
  keyHandler: KeyHandler;

  constructor(
    private x: number,
    private y: number,
    private width: number,
    private height: number
  ) {
    this.keyHandler = new KeyHandler();
  }

  update() {
    if (this.keyHandler.forward) {
      this.y -= 2;
    }
    else if (this.keyHandler.reverse) {
      this.y += 2;
    }
  }

  draw(ctx: any) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.rect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    ctx.fill();
  }
}
