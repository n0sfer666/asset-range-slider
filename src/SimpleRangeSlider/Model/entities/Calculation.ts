class Calculation {
  private config: iConfigModel;

  private range: tRange;

  private value: tValue;

  private step: number;

  private activeIndex: number = 0;

  private readonly normalizingCoefficient: number = 1e4;

  constructor(config: iConfigModel) {
    this.config = config;
    this.range = this.config.range;
    this.value = this.config.start;
    this.step = this.config.step;
  }
}

export default Calculation;
