class Calculation {
  config: iConfigModel;

  range: tRange;

  value: tValue;

  step: number;

  activeIndex: number = 0;

  readonly normalizingCoefficient: number = 1e4;

  constructor(config: iConfigModel) {
    this.config = config;
    this.range = this.config.range;
    this.value = this.config.start;
    this.step = this.config.step;
  }
}

export default Calculation;
