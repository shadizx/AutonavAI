import { interpolate } from "~/utils/Utility";

export class NeuralNetwork {
  levels: Level[];

  constructor(neuronCounts: number[]) {
    this.levels = neuronCounts
      .slice(0, -1)
      .map((count, i) => new Level(count, neuronCounts[i + 1]));
  }

  static feedForward(inputs: number[], network: NeuralNetwork): number[] {
    let outputs = Level.feedForward(inputs, network.levels[0]);
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }
    return outputs;
  }

  static mutate(network: any, randomPercentChange = 1) {
    network.levels.forEach((level: any) => {
      level.biases = level.biases.map((bias: number) =>
        interpolate(bias, Math.random() * 2 - 1, randomPercentChange)
      );
      level.weights = level.weights.map((weights: any[]) =>
        weights.map((weight) =>
          interpolate(weight, Math.random() * 2 - 1, randomPercentChange)
        )
      );
    });
  }
}

export class Level {
  inputs: number[];
  outputs: number[];
  biases: number[];
  weights: number[][];

  constructor(inputCount: number, outputCount: number) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount);

    this.weights = Array.from(
      { length: inputCount },
      () => new Array(outputCount)
    );

    Level.randomize(this);
  }

  static feedForward(inputs: number[], level: Level): number[] {
    level.inputs = [...inputs];

    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }

      level.outputs[i] = sum > level.biases[i] ? 1 : 0;
    }

    return level.outputs;
  }

  // generate a random neural network to begin with
  private static randomize(level: Level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1;
      }
    }

    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }
}
