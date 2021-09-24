class Model {
  private readonly normalizingCoefficient: number = 1e4;

  private readonly defaultConfig: CompleteConfigList = {
    orientation: 'horizontal',
    values: [10],
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

  private positions: PointerPosition;

  private values: PointerValue;

  private isSinglePointer: boolean;

  private activePointerIndex: number = 0;

  constructor(config: UserConfigList) {
    this.config = this.getVerifiedConfig({ ...this.defaultConfig, ...config });
    const { range, values, step } = this.config;
    this.values = [...values];
    this.range = [...range];
    this.step = step;
    this.isSinglePointer = values.length === 1;
    this.positions = <PointerPosition> this.values.map((value) => this.getPositionFromValue(value));
  }

  getPosition(): PointerPosition {
    return this.positions;
  }

  getVerifiedConfig(userConfig: CompleteConfigList): CompleteConfigList {
    const config: CompleteConfigList = { ...userConfig };
    if (this.step !== config.step) {
      config.step = config.step > 0
        ? config.step
        : this.defaultConfig.step;
    }

    const { values, range } = config;
    this.isSinglePointer = values.length === 1;
    if (JSON.stringify(this.range) !== JSON.stringify(range)) {
      const isCorrectRange = typeof values[1] === 'number'
        ? range[0] <= values[0] && range[1] >= values[1]
        : range[0] <= values[0] && range[1] >= values[0];
      if (typeof values[1] === 'number') {
        config.range = isCorrectRange
          ? range
          : [values[0], values[1]];
      } else {
        config.range = isCorrectRange
          ? range
          : [values[0] - 100, values[0] + 100];
      }
    }

    if (JSON.stringify(this.values) !== JSON.stringify(values)) {
      if (typeof config.values[1] === 'number') {
        config.values[0] = values[0] >= range[0] && values[0] < config.values[1]
          ? values[0]
          : range[0];
        config.values[1] = config.values[1] >= values[0] && config.values[1] <= range[1]
          ? config.values[1]
          : range[1];
      } else {
        config.values[0] = values[0] >= range[0] && values[0] <= range[1]
          ? values[0]
          : range[0];
      }
    }
    return config;
  }

  getConfig(): CompleteConfigList {
    return this.config;
  }

  getViewConfig(): ViewConfigList {
    const {
      orientation, connect, scale, tooltip,
    } = this.config;
    return {
      orientation, connect, scale, tooltip,
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
    if (typeof position === 'number') {
      if (position <= 0) {
        return this.range[0];
      }
      if (position >= 1) {
        return this.range[1];
      }
      newValue = this.getValueFromPosition(position);
    }
    if (typeof value === 'number') {
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
    this.callbackList.forEach(
      (viewCallback: ModelCallback) => viewCallback({
        index,
        positions: this.positions,
        values: this.values,
      }),
    );
  }

  getViewUpdateList(config: UserConfigList): ViewUpdateList {
    this.config = this.getVerifiedConfig({ ...this.config, ...config });
    this.values = config.values ? [...config.values] : this.values;
    this.range = config.range ? [...config.range] : this.range;
    this.step = config.step ? config.step : this.step;
    const viewUpdateList: ViewUpdateList = {
      values: this.values,
      range: this.range,
      ...config,
    };
    if (config.values || config.range) {
      this.positions = <PointerPosition> this.values.map(
        (value) => this.getPositionFromValue(value),
      );
      viewUpdateList.positions = [...this.positions];
    }
    return viewUpdateList;
  }
}

export default Model;
