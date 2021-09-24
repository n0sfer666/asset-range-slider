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

  private callbackList: ModelCallback[] = [];

  private positions: PointerPosition;

  private isSinglePointer: boolean;

  private activePointerIndex: number = 0;

  constructor(config: UserConfigList) {
    this.config = this.getVerifiedConfig({ ...this.defaultConfig, ...config });
    this.isSinglePointer = this.config.values.length === 1;
    this.positions = <PointerPosition> this.config.values.map(
      (value) => this.getPositionFromValue(value),
    );
  }

  getPosition(): PointerPosition {
    return this.positions;
  }

  getVerifiedConfig(userConfig: CompleteConfigList): CompleteConfigList {
    const config: CompleteConfigList = { ...userConfig };
    if (this.config.step !== config.step) {
      config.step = config.step > 0
        ? config.step
        : this.defaultConfig.step;
    }

    const { values, range } = config;
    this.isSinglePointer = values.length === 1;
    if (JSON.stringify(this.config.range) !== JSON.stringify(range)) {
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

    if (JSON.stringify(this.config.values) !== JSON.stringify(values)) {
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
    return this.config.values;
  }

  subscribeOn(callback: ModelCallback) {
    this.callbackList.push(callback);
  }

  getPositionFromValue(value: number): number {
    const { range } = this.config;
    const result: number = (value - range[0]) / (range[1] - range[0]);
    return Math.round(result * this.normalizingCoefficient) / this.normalizingCoefficient;
  }

  getValueFromPosition(position: number): number {
    const { range } = this.config;
    const result: number = (position * (range[1] - range[0])) + range[0];
    return Math.round(result);
  }

  getNewValue(viewData: ViewData): number {
    const { index, position, value } = viewData;
    let newValue = 0;
    if (typeof position === 'number') {
      if (position <= 0) {
        return this.config.range[0];
      }
      if (position >= 1) {
        return this.config.range[1];
      }
      newValue = this.getValueFromPosition(position);
    }
    if (typeof value === 'number') {
      if (value <= this.config.range[0]) {
        return this.config.range[0];
      }
      if (value >= this.config.range[1]) {
        return this.config.range[1];
      }
      newValue = value;
    }
    const isFirstOfNotSinglePointer = index === 0 && !this.isSinglePointer;
    if (isFirstOfNotSinglePointer && this.config.values[1]) {
      const boundary = this.config.values[1] - this.config.step;
      const isValueBiggerThanOther = boundary < newValue;
      return isValueBiggerThanOther ? boundary : newValue;
    }
    if (index === 1) {
      const boundary = this.config.values[0] + this.config.step;
      const isValueBiggerThanOther = boundary > newValue;
      return isValueBiggerThanOther ? boundary : newValue;
    }
    return newValue;
  }

  setValueAndPosition(newValue: number, index: number) {
    const leftBoundary = this.config.values[index] - (this.config.step / 2);
    const rightBoundary = this.config.values[index] + (this.config.step / 2);
    const isOutOfBoundary = newValue >= rightBoundary || newValue <= leftBoundary;
    const resultValue = Math.round(newValue / this.config.step) * this.config.step;

    if (isOutOfBoundary) {
      this.config.values[index] = resultValue;
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
        values: this.config.values,
      }),
    );
  }

  getViewUpdateList(config: UserConfigList): ViewUpdateList {
    this.config = this.getVerifiedConfig({ ...this.config, ...config });
    const viewUpdateList: ViewUpdateList = {
      values: this.config.values,
      range: this.config.range,
      ...config,
    };
    if (config.values || config.range) {
      this.positions = <PointerPosition> this.config.values.map(
        (value) => this.getPositionFromValue(value),
      );
      viewUpdateList.positions = [...this.positions];
    }
    return viewUpdateList;
  }
}

export default Model;
