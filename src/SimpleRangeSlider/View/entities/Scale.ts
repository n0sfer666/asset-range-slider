import ScaleClassNames from './types';

class Scale {
  readonly valuePipsNumber: number = 5;

  readonly emptyPipsNumber: number = 1;

  readonly classNames: ScaleClassNames = {
    slider: 'simple-range-slider',
    scale: 'scale',
    pip: 'scale-pip',
    dash: 'scale-pip-dash',
    value: 'scale-pip-value',
    modifier: {
      empty: 'empty',
    },
  };

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

  getElement(elementName: string, modifier?: string): JQuery {
    const $element: JQuery = jQuery(document.createElement('div'));
    $element.addClass(`${this.classNames.slider}__${elementName}`);
    if (modifier) {
      $element.addClass(`${this.classNames.slider}__${elementName}_${modifier}`);
    }
    return $element;
  }

  getDiapason(): number {
    return (this.range[1] - this.range[0]);
  }

  initElements() {
    this.$element = this.getElement(this.classNames.scale, this.orientation);
    this.emptyPips = this.getEmptyPips();
    this.valuePips = this.getValuePips();
  }

  getEmptyPips(): JQuery[] {
    const emptyPips: JQuery[] = [];
    for (let i = 0; i < this.emptyPipsNumber; i += 1) {
      const $emptyDash = this.getElement(this.classNames.dash, this.classNames.modifier.empty);
      emptyPips.push(this.getElement(this.classNames.pip).append($emptyDash));
    }
    return emptyPips;
  }

  getValuePips(): JQuery[] {
    const valuePips: JQuery[] = this.values.map(() => {
      const $dash = this.getElement(this.classNames.dash);
      const $pipValue = this.getElement(this.classNames.value);
      const $pip = this.getElement(this.classNames.pip);
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
    const {
      slider, dash, value, modifier,
    } = this.classNames;
    if (this.emptyPips.length === this.emptyPipsNumber) {
      this.emptyPips = [];
      this.$element.children().each((_, pip) => {
        const $pip = $(pip);
        if ($pip.children().hasClass(`${slider}__${dash}_${modifier.empty}`)) {
          this.emptyPips.push($pip);
        }
      });
    }
    this.valuePips.forEach(($pip, index) => {
      this.setPipPosition($pip, this.values[index]);
      $pip.find(`.${slider}__${value}`).text(this.values[index]);
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
    const value = $(event.target).hasClass(`${this.classNames.slider}__${this.classNames.value}`)
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
      this.$element.removeClass(`simple-range-slider__scale_${this.orientation}`);
      this.orientation = newOrientation;
      this.$element.addClass(`simple-range-slider__scale_${this.orientation}`);
      ['left', 'top'].forEach((cssAttribute) => this.$element.children().css(cssAttribute, ''));
    }
    this.updatePips();
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
