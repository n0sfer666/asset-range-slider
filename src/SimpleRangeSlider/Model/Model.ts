class Model {
  private readonly normalizingCoefficient: number = 1e4;

  private readonly defaultConfig: CompleteConfigList = {
    orientation: 'horizontal',
    values: [10],
    range: [0, 100],
    step: 1,
    withConnect: true,
    withTooltip: true,
    withScale: true,
  };

  private config: CompleteConfigList;

  private callbackList: ModelCallback[] = [];

  private positions: PointerPosition;

  private isSinglePointer: boolean;

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
    const lastCorrectConfig: CompleteConfigList = this.config === undefined
      ? JSON.parse(JSON.stringify(this.defaultConfig))
      : JSON.parse(JSON.stringify(this.config));
    const config: CompleteConfigList = JSON.parse(JSON.stringify(userConfig));
    const { range, values } = config;
    const checks: boolean[] = [true];
    if (config.step <= 0 || config.step > (range[1] - range[0])) {
      checks.push(false);
    }
    if (typeof values[1] === 'number') {
      if (values[0] < range[0] || values[0] >= values[1]) {
        checks.push(false);
      }
      if (values[1] <= values[0] || values[1] > range[1]) {
        checks.push(false);
      }
    } else if (values[0] < range[0] || values[0] > range[1]) {
      checks.push(false);
    }
    const result: CompleteConfigList = checks.reduce(
      (previousValue, currentValue) => previousValue && currentValue,
    )
      ? config
      : lastCorrectConfig;
    return result;
  }

  getConfig(): CompleteConfigList {
    return JSON.parse(JSON.stringify(this.config));
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
    const { activePointerIndex, position, value } = viewData;
    let newValue = NaN;
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
    if (typeof position === 'number') {
      const isFirstOfNotSinglePointer = activePointerIndex === 0 && !this.isSinglePointer;
      if (isFirstOfNotSinglePointer && this.config.values[1]) {
        const boundary = this.config.values[1] - this.config.step;
        const isValueBiggerThanOther = boundary < newValue;
        return isValueBiggerThanOther ? boundary : newValue;
      }
      if (activePointerIndex === 1) {
        const boundary = this.config.values[0] + this.config.step;
        const isValueBiggerThanOther = boundary > newValue;
        return isValueBiggerThanOther ? boundary : newValue;
      }
    }
    return newValue;
  }

  setValueAndPosition(newValue: number, index: number) {
    const { range, values, step } = this.config;
    const leftBoundary = values[index] - (step / 2);
    const rightBoundary = values[index] + (step / 2);
    const isOutOfBoundary = newValue >= rightBoundary || newValue <= leftBoundary;
    const resultValue = Math.round(newValue / step) * step;

    if (isOutOfBoundary) {
      if (!this.isSinglePointer && typeof values[1] === 'number') {
        const isNotOutOfRange = index === 0
          ? resultValue >= range[0] && resultValue < values[1]
          : resultValue > values[0] && resultValue <= range[1];
        if (isNotOutOfRange) {
          values[index] = resultValue;
          this.positions[index] = this.getPositionFromValue(resultValue);
        }
      } else {
        const isNotOutOfRange = resultValue >= range[0] && resultValue <= range[1];
        if (isNotOutOfRange) {
          this.config.values[index] = resultValue;
          this.positions[index] = this.getPositionFromValue(resultValue);
        }
      }
    }
  }

  updateByView(viewData: ViewData) {
    const { activePointerIndex, value, position } = viewData;
    const { range, values } = this.config;
    if (typeof value === 'number') {
      let isCorrectValue = false;
      if (typeof values[1] === 'number') {
        if (activePointerIndex === 0) {
          isCorrectValue = value >= range[0] && value < values[1];
        } else {
          isCorrectValue = value > values[0] && value <= range[1];
        }
      } else {
        isCorrectValue = value >= range[0] && value <= range[1];
      }
      values[activePointerIndex] = isCorrectValue ? value : values[activePointerIndex];
      this.positions[activePointerIndex] = this.getPositionFromValue(
        values[activePointerIndex],
      );
    } else if (typeof position === 'number') {
      const isNextMax = position > this.getPositionFromValue(range[1] - (this.config.step / 2));
      const isNextMin = position < this.getPositionFromValue(range[0] + (this.config.step / 2));
      if (isNextMin || isNextMax) {
        if (this.isSinglePointer) {
          this.positions[activePointerIndex] = isNextMin ? 0 : 1;
          values[activePointerIndex] = isNextMin ? range[0] : range[1];
        } else if (activePointerIndex === 0 && isNextMin) {
          this.positions[activePointerIndex] = 0;
          values[activePointerIndex] = range[0];
        } else if (activePointerIndex === 1 && isNextMax) {
          this.positions[activePointerIndex] = 1;
          values[activePointerIndex] = range[1];
        }
      } else {
        const newValue = this.getNewValue(viewData);
        this.setValueAndPosition(newValue, activePointerIndex);
      }
    }
    this.callbackList.forEach(
      (viewCallback: ModelCallback) => viewCallback({
        index: activePointerIndex,
        positions: [...this.positions],
        values: [...this.config.values],
      }),
    );
  }

  getViewUpdateList(config: UserConfigList): ViewUpdateList {
    this.config = this.getVerifiedConfig({ ...this.config, ...config });
    this.isSinglePointer = this.config.values.length === 1;
    this.positions = <PointerPosition> this.config.values.map(
      (value) => this.getPositionFromValue(value),
    );
    return {
      ...this.config,
      positions: [...this.positions],
    };
  }
}

export default Model;
