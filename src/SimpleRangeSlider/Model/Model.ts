class Model {
  readonly normalizingCoefficient: number = 1e4;

  config: iConfigModel;

  callbackList: iModelCallback[] = [];

  positions: number[];

  range: tRange;

  value: number[];

  step: number;

  activePointerIndex: number = 0;

  constructor(config: iConfigModel) {
    this.config = config;
    this.value = config.start;
    this.range = config.range;
    this.step = config.step;
    this.positions = this.value.map((val) => this.getPositionFromValue(val));
    this.bindContext();
  }

  subscribeOn(callback: iModelCallback) {
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

  getNewValue(viewData: tViewData): number {
    const { index, position, value } = viewData;
    
    const newValue: number = value || this.getValueFromPosition(position || NaN);
    const isTwoPointerSlider = !!this.value[1];
    const rightBoundary = this.value[1] - this.step;
    const leftBoundary = this.value[0] + this.step;
    const isValueOfLeftPointerBiggerThanRight = newValue > rightBoundary;
    const isValueOfRightPointerSmallerThanLeft = newValue < leftBoundary;
    if (index === 0 && isTwoPointerSlider) {
      return isValueOfLeftPointerBiggerThanRight ? rightBoundary : newValue;
    }
    if (index === 1) {
      return isValueOfRightPointerSmallerThanLeft ? leftBoundary : newValue;
    }
    return newValue;
  }

  setValueAndPosition(newValue: number, index: number) {
    const leftBoundary = this.value[index] - this.step;
    const rightBoundary = this.value[index] + this.step;
    const isOutOfRange = newValue < this.range[0] || newValue > this.range[1];
    const isOutOfBoundary = newValue >= rightBoundary || newValue <= leftBoundary;
    const resultValue = newValue > 0
      ? (Math.ceil(newValue / this.step) * this.step)
      : (Math.floor(newValue / this.step) * this.step);
    const lastValue = this.value[index];

    if (!isOutOfRange && isOutOfBoundary) {
      this.value[index] = resultValue;
      this.positions[index] = this.getPositionFromValue(resultValue);
    }
  }

  updateByView(viewData: tViewData) {
    this.activePointerIndex = viewData.index;
    const newValue = this.getNewValue(viewData);
    this.setValueAndPosition(newValue, this.activePointerIndex);
    this.callbackList.forEach(
      (viewCallback: iModelCallback) => viewCallback({
        positions: this.positions,
        values: this.value,
        index: this.activePointerIndex,
      }),
    );
  }

  bindContext() {
    this.updateByView = this.updateByView.bind(this);
  }
}

export default Model;
