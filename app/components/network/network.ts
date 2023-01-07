export default class Level {
  inputs: number[];
  outputs: number[];
  biases: number[];
  weights: number[][];

  constructor(inputCount: number, outputCount: number) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount);

    this.weights = Array.from({ length: inputCount }, () =>
      new Array(inputCount).fill(0)
    );

    Level.randomize(this);
  }

  // generate a random neural network to begin with
  private static randomize(level: Level) {
    level.inputs.forEach((input, i) => {
      level.outputs.forEach((output, j) => {
        level.weights[i][j] = Math.random() * 2 - 1;
      });
    });

    level.biases.forEach((bias, i) => {
      level.biases[i] = Math.random() * 2 - 1;
    });
  }

  // compute output values using feed forward algorithm
  static feedForward(inputs: number[], level: Level) {
    level.inputs = level.inputs.map((input, index) => inputs[index]);

    level.outputs.forEach((output, i) => {
      const sum = level.inputs.reduce(
        (acc, input, j) => acc + input * level.weights[j][i],
        0
      );
      level.outputs[i] = sum > level.biases[i] ? 1 : 0;
    });

    return level.outputs;
  }
}
