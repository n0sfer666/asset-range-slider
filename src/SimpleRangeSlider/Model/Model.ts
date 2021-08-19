class Model {
  private readonly normalizingCoefficient: number = 1e4;

  private readonly defaultConfig: CompleteConfigList = {
    orientation: 'horizontal',
    start: [10],
    range: [0, 100],
    step: 1,
    connect: true,
    tooltip: true,
    scale: true,
  };

  private config: CompleteConfigList;

  private range: ConfigRange;

  private step: number;

  private callbackList: ModelCallback[] = [];

  private positions: PointerValue;

  private values: PointerValue;

  private isSinglePointer: boolean;

  private activePointerIndex: number = 0;

  constructor(config: UserConfigList) {
    this.config = this.getVerifiedConfig(Model.getCompleteConfig(this.defaultConfig, config));
    const { range, start, step } = this.config;
    this.values = [...start];
    this.range = [...range];
    this.step = step;
    this.isSinglePointer = start.length === 1;
    this.positions = <PointerValue> this.values.map((value) => this.getPositionFromValue(value));
  }

  static getCompleteConfig(
    defaultConfig: CompleteConfigList,
    userConfig: UserConfigList,
  ): CompleteConfigList {
    return { ...defaultConfig, ...userConfig };
  }

  getVerifiedConfig(userConfig: CompleteConfigList): CompleteConfigList {
    const config = { ...userConfig };
    config.step = config.step > 0
      ? config.step
      : this.defaultConfig.step;
    config.range = Math.abs(config.range[1] - config.range[0]) >= 5
      ? config.range
      : this.defaultConfig.range;

    if (config.start[1]) {
      const isFirstStartCorrect = config.start[0] >= config.range[0]
        && config.start[0] < config.start[1]
        && config.start[0] <= config.range[1];
      config.start[0] = isFirstStartCorrect
        ? config.start[0]
        : config.range[0];
      config.start[1] = config.start[1] > config.start[0] && config.start[1] <= config.range[1]
        ? config.start[1]
        : config.range[1];
    } else {
      config.start[0] = config.start[0] >= config.range[0] && config.start[0] <= config.range[1]
        ? config.start[0]
        : config.range[0];
    }
    return config;
  }

  getConfig(): CompleteConfigList {
    return this.config;
  }

  getViewConfig(): ViewConfigList {
    const {
      orientation, connect, scale, tooltip, input,
    } = this.config;
    return {
      orientation, connect, scale, tooltip, input,
    };
  }

  getValues(): PointerValue {
    return this.values;
  }

  subscribeOn(callback: ModelCallback) {
    this.callbackList.push(callback);
  }

  getPositionFromValue(value: number): number {
    const result: number = (value - this.range[0]) / (this.range[1] - this.range[0]);
    return Math.round(result * this.normalizingCoefficient) / this.normalizingCoefficient;
  }

  getValueFromPosition(position: number): number {
    const result: number = (position * (this.range[1] - this.range[0])) + this.range[0];
    return Math.round(result);
  }

  getNewValue(viewData: ViewData): number {
    const { index, position, value } = viewData;
    let newValue = 0;
    if (position || position === 0) {
      if (position <= 0) {
        return this.range[0];
      }
      if (position >= 1) {
        return this.range[1];
      }
      newValue = this.getValueFromPosition(position);
    }
    if (value || value === 0) {
      if (value <= this.range[0]) {
        return this.range[0];
      }
      if (value >= this.range[1]) {
        return this.range[1];
      }
      newValue = value;
    }
    const isFirstOfNotSinglePointer = index === 0 && !this.isSinglePointer;
    if (isFirstOfNotSinglePointer && this.values[1]) {
      const boundary = this.values[1] - this.step;
      const isValueBiggerThanOther = boundary < newValue;
      return isValueBiggerThanOther ? boundary : newValue;
    }
    if (index === 1) {
      const boundary = this.values[0] + this.step;
      const isValueBiggerThanOther = boundary > newValue;
      return isValueBiggerThanOther ? boundary : newValue;
    }
    return newValue;
  }

  setValueAndPosition(newValue: number, index: number) {
    const leftBoundary = this.values[index] - (this.step / 2);
    const rightBoundary = this.values[index] + (this.step / 2);
    const isOutOfBoundary = newValue >= rightBoundary || newValue <= leftBoundary;
    const resultValue = Math.round(newValue / this.step) * this.step;

    if (isOutOfBoundary) {
      this.values[index] = resultValue;
      this.positions[index] = this.getPositionFromValue(resultValue);
    }
  }

  updateByView(viewData: ViewData) {
    const { index } = viewData;
    this.activePointerIndex = index;
    const newValue = this.getNewValue(viewData);
    this.setValueAndPosition(newValue, index);
    const { positions, values } = this;
    this.callbackList.forEach(
      (viewCallback: ModelCallback) => viewCallback({ positions, values, index }),
    );
  }

  getViewUpdateList(config: UserConfigList): ViewUpdateList {
    const viewUpdateList: ViewUpdateList = {};
    this.config = this.getVerifiedConfig({ ...this.config, ...config });
    this.values = config.start ? [...config.start] : this.values;
    this.range = config.range ? [...config.range] : this.range;
    this.step = config.step ? config.step : this.step;
    if (config.start || config.range) {
      this.positions = <PointerValue> this.values.map((value) => this.getPositionFromValue(value));
      viewUpdateList.positions = [...this.positions];
    }
    Object.keys(config).forEach((key) => {
      viewUpdateList[key] = Array.isArray(this.config[key])
        ? [...this.config[key]]
        : this.config[key];
    });
    viewUpdateList.values = this.values;
    viewUpdateList.range = this.range;
    return viewUpdateList;
  }
}

export default Model;
