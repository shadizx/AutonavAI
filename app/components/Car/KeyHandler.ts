export default class KeyHandler {
  forward: boolean;
  reverse: boolean;
  left: boolean;
  right: boolean;

  constructor(controlType: string) {
    this.forward = false;
    this.reverse = false;
    this.left = false;
    this.right = false;

    switch (controlType) {
      case "KEYS":
        this.addKeyListeners();
        break;
      case "DUMMY":
        this.forward = true;
        break;
    }
  }

  addKeyListeners() {
    if (typeof window === "undefined") return;
    document.onkeydown = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          this.left = true;
          break;
        case "ArrowRight":
          this.right = true;
          break;
        case "ArrowUp":
          this.forward = true;
          break;
        case "ArrowDown":
          this.reverse = true;
          break;
      }
    };
    document.onkeyup = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          this.left = false;
          break;
        case "ArrowRight":
          this.right = false;
          break;
        case "ArrowUp":
          this.forward = false;
          break;
        case "ArrowDown":
          this.reverse = false;
          break;
      }
    };
  }
}
