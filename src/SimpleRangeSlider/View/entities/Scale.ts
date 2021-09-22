const classes = {
  root: 'simple-range-slider__scale',
  pip: 'simple-range-slider__scale-pip',
  pipDash: 'simple-range-slider__scale-pip-dash',
  pipValue: 'simple-range-slider__scale-pip-value',
};

class Scale {
  readonly valuePipsNumber: number = 5;

  readonly emptyPipsNumber: number = 2;

  $element: JQuery;

  range: ConfigRange;

  orientation: ConfigOrientation;

  emptyPips: JQuery[] = [];

  valuePips: JQuery[] = [];

  callbackList: ScaleCallback[] = [];

  diapason: number;

  values: number[] = [];

  emptyValues: number[] = [];

  constructor(range: ConfigRange, orientation: ConfigOrientation) {
    this.bindContext();
    this.orientation = orientation;
    this.range = range;
    this.diapason = this.getDiapason();
    this.values = this.getValues();
    this.emptyValues = this.getEmptyValues();
    this.initElements();
    this.drawPips();
    this.bindHandler();
  }

  static getElement(elementClassName: string, modifier?: string): JQuery {
    const $element: JQuery = jQuery(document.createElement('div'));
    $element.addClass(`${elementClassName}`);
    if (modifier) {
      $element.addClass(`${elementClassName}_${modifier}`);
    }
    return $element;
  }

  getDiapason(): number {
    return (this.range[1] - this.range[0]);
  }

  initElements() {
    this.$element = Scale.getElement(classes.root, this.orientation);
    this.emptyPips = this.getEmptyPips();
    this.valuePips = this.getValuePips();
  }

  getEmptyPips(): JQuery[] {
    const emptyPips: JQuery[] = [];
    for (let i = 0; i < this.emptyPipsNumber; i += 1) {
      const $emptyDash = Scale.getElement(classes.pipDash, 'empty');
      emptyPips.push(Scale.getElement(classes.pip).append($emptyDash));
    }
    return emptyPips;
  }

  getValuePips(): JQuery[] {
    const valuePips: JQuery[] = this.values.map(() => {
      const $dash = Scale.getElement(classes.pipDash);
      const $pipValue = Scale.getElement(classes.pipValue);
      const $pip = Scale.getElement(classes.pip);
      $pip.append(this.orientation === 'horizontal' ? [$dash, $pipValue] : [$pipValue, $dash]);
      return $pip;
    });

    return valuePips;
  }

  drawPips() {
    this.valuePips.forEach(($valuePip, index) => {
      this.$element.append($valuePip);
      const isNotLast: boolean = this.valuePips.length - 1 !== index;
      if (isNotLast) {
        this.emptyPips.forEach(($emptyPip) => this.$element.append($emptyPip.clone()));
      }
    });
    this.updatePips();
  }

  updatePips() {
    if (this.emptyPips.length === this.emptyPipsNumber) {
      this.emptyPips = [];
      this.$element.children().each((_, pip) => {
        const $pip = $(pip);
        if ($pip.children().hasClass(`${classes.pipDash}_empty`)) {
          this.emptyPips.push($pip);
        }
      });
    }
    this.valuePips.forEach(($pip, index) => {
      this.setPipPosition($pip, this.values[index]);
      $pip.find(`.${classes.pipValue}`).text(this.values[index]);
    });
    this.emptyPips.forEach(($pip, index) => this.setPipPosition($pip, this.emptyValues[index]));
  }

  setPipPosition($pip: JQuery, value: number) {
    $pip.css(
      this.orientation === 'horizontal' ? 'left' : 'top',
      `${this.getPositionByValue(value)}%`,
    );
  }

  getValues(): number[] {
    const difference: number = Math.round(this.diapason / (this.valuePipsNumber - 1));
    return new Array(this.valuePipsNumber).fill(this.range[0]).map((value, index) => {
      const newVal = value + difference * index;
      return newVal <= this.range[1] ? newVal : this.range[1];
    });
  }

  getEmptyValues(): number[] {
    const emptyValues: number[] = [];
    this.values.forEach((value, index) => {
      const isNotLast = index !== this.values.length - 1;
      if (isNotLast) {
        const difference = (this.values[index + 1] - value) / (this.emptyPipsNumber + 1);
        new Array(this.emptyPipsNumber)
          .fill(difference)
          .forEach((val, i) => emptyValues.push(value + val * (i + 1)));
      }
    });
    return emptyValues;
  }

  getPositionByValue(value: number): number {
    const result = (value - this.range[0]) / (this.range[1] - this.range[0]);
    return Math.round(result * 1e6) / 1e4;
  }

  handlerValuePipClick(event: JQuery.MouseEventBase) {
    event.stopPropagation();
    const value = $(event.target).hasClass(`${classes.pipValue}`)
      ? Number($(event.target).text())
      : Number($(event.target).siblings().text());
    this.callbackList.forEach((callback) => {
      callback({ value });
    });
  }

  updateScale(newRange: ConfigRange, newOrientation?: ConfigOrientation) {
    this.range = newRange;
    this.diapason = this.getDiapason();
    this.values = this.getValues();
    this.emptyValues = this.getEmptyValues();
    if (newOrientation) {
      this.setOrientation(newOrientation);
      ['left', 'top'].forEach((cssAttribute) => this.$element.children().css(cssAttribute, ''));
    }
    this.updatePips();
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
