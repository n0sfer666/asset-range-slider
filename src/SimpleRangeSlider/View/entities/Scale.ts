const classes = {
  root: 'simple-range-slider__scale',
  pip: 'simple-range-slider__scale-pip',
  pipDash: 'simple-range-slider__scale-pip-dash',
  pipValue: 'simple-range-slider__scale-pip-value',
};

class Scale {
  readonly maxValuePipsNumber: number = 5;

  valuePipsNumber: number = NaN;

  $element: JQuery;

  range: ConfigRange;

  orientation: ConfigOrientation;

  step: number;

  valuePips: JQuery[] = [];

  callbackList: ScaleCallback[] = [];

  diapason: number;

  values: number[] = [];

  constructor(range: ConfigRange, orientation: ConfigOrientation, step: number) {
    this.bindContext();
    this.orientation = orientation;
    this.range = range;
    this.step = step;
    this.diapason = this.getDiapason();
    this.values = this.getValues();
    this.initElements();
    this.drawPips();
    this.bindHandler();
  }

  static getElement(elementClassName: string, modifier?: string): JQuery {
    const $element: JQuery = jQuery(`<div class = '${elementClassName}'></div>`);
    if (modifier) {
      $element.addClass(`${elementClassName}_${modifier}`);
    }
    return $element;
  }

  setStep(newStep: number) {
    this.step = newStep;
    this.updateScale(this.range);
  }

  getDiapason(): number {
    return (this.range[1] - this.range[0]);
  }

  initElements() {
    this.$element = Scale.getElement(classes.root, this.orientation);
    this.valuePips = this.getValuePips();
  }

  getValuePips(): JQuery[] {
    return this.values.map(() => {
      const $dash = Scale.getElement(classes.pipDash);
      const $pipValue = Scale.getElement(`${classes.pipValue} js-${classes.pipValue}`);
      return Scale.getElement(classes.pip).append(
        this.orientation === 'horizontal' ? [$dash, $pipValue] : [$pipValue, $dash],
      );
    });
  }

  drawPips() {
    this.valuePips.forEach(($valuePip) => {
      this.$element.append($valuePip);
    });
    this.updatePips();
  }

  updatePips() {
    this.valuePips.forEach(($pip, index) => {
      this.setPipPosition($pip, this.values[index]);
      $pip.find(`.js-${classes.pipValue}`).text(this.values[index]);
    });
  }

  setPipPosition($pip: JQuery, value: number) {
    $pip.css(
      this.orientation === 'horizontal' ? 'left' : 'top',
      `${this.getPositionByValue(value)}%`,
    );
  }

  getValues(): number[] {
    const difference: number = Math.round(this.diapason / (this.maxValuePipsNumber - 1));
    const scaleStep = Math.round(difference / this.step) * this.step;
    const lastValueIndex = Math.ceil(this.diapason / scaleStep) + 1;
    this.valuePipsNumber = lastValueIndex <= this.maxValuePipsNumber
      ? lastValueIndex
      : this.maxValuePipsNumber;
    return new Array(this.valuePipsNumber)
      .fill(this.range[0])
      .map((value, index) => {
        const newVal = value + scaleStep * index;
        return newVal < (this.range[1] - this.step) ? newVal : this.range[1];
      });
  }

  getPositionByValue(value: number): number {
    const result = (value - this.range[0]) / (this.range[1] - this.range[0]);
    return Math.round(result * 1e6) / 1e4;
  }

  handlerValuePipClick(event: JQuery.MouseEventBase) {
    event.stopPropagation();
    const value = $(event.target).hasClass(`js-${classes.pipValue}`)
      ? Number($(event.target).text())
      : Number($(event.target).siblings().text());
    this.callbackList.forEach((callback) => {
      callback({ value });
    });
  }

  updateScale(newRange: ConfigRange, newOrientation?: ConfigOrientation) {
    this.range = newRange;
    const lastValuePipsNumber = this.valuePipsNumber;
    this.diapason = this.getDiapason();
    this.values = this.getValues();
    if (newOrientation) {
      this.setOrientation(newOrientation);
    }
    if (lastValuePipsNumber === this.valuePipsNumber) {
      ['left', 'top'].forEach((cssAttribute) => this.$element.children().css(cssAttribute, ''));
      this.updatePips();
    } else {
      this.$element.children().remove();
      this.drawPips();
      this.bindHandler();
    }
  }

  setOrientation(orientation: ConfigOrientation) {
    if (this.orientation !== orientation) {
      this.$element.removeClass(`${classes.root}_${this.orientation}`);
      this.orientation = orientation;
      this.$element.addClass(`${classes.root}_${this.orientation}`);
    }
  }

  subscribeOn(callback: ScaleCallback) {
    this.callbackList.push(callback);
  }

  bindContext() {
    this.handlerValuePipClick = this.handlerValuePipClick.bind(this);
  }

  bindHandler() {
    this.valuePips.forEach(($valueDashPip) => {
      $valueDashPip.on('click', this.handlerValuePipClick);
    });
  }
}

export default Scale;
