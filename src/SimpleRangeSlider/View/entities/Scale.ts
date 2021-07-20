class Scale {
  readonly valuePipsNumber: number = 5;

  readonly emptyPipsNumber: number = 1;

  $element: JQuery;

  range: ConfigRange;

  orientation: ConfigOrientation;

  emptyPips: JQuery[] = [];

  valuePips: JQuery[] = [];

  callbackList: ScaleCallback[] = [];

  diapason: number;

  values: number[] = [];

  constructor(range: ConfigRange, orientation: ConfigOrientation) {
    this.bindContext();
    this.orientation = orientation;
    this.range = range;
    this.diapason = this.range[1] - this.range[0];
    this.values = this.getValues();
    this.initElements();
    this.drawPips();
    this.bindHandler();
  }

  static getElement(elementName: string, modifier?: string): JQuery {
    const $element: JQuery = jQuery(document.createElement('div'));
    $element.addClass(`simple-range-slider__${elementName}`);
    if (modifier) {
      $element.addClass(`simple-range-slider__${elementName}_${modifier}`);
    }
    return $element;
  }

  initElements() {
    this.$element = Scale.getElement('scale', this.orientation);
    this.emptyPips = this.getEmptyPips();
    this.valuePips = this.getValuePips();
  }

  getEmptyPips(): JQuery[] {
    const emptyPips: JQuery[] = [];
    for (let i = 0; i < this.emptyPipsNumber; i += 1) {
      const $emptyDash = Scale.getElement('scale-pip-dash', 'empty');
      emptyPips.push(Scale.getElement('scale-pip').append($emptyDash));
    }
    return emptyPips;
  }

  getValuePips(): JQuery[] {
    const valuePips: JQuery[] = this.values.map((value) => {
      const $dash = Scale.getElement('scale-pip-dash');
      const $pipValue = Scale.getElement('scale-pip-value').text(value);
      const $pip = Scale.getElement('scale-pip');
      $pip.append(this.orientation === 'horizontal' ? [$dash, $pipValue] : [$pipValue, $dash]);
      return $pip;
    });

    return valuePips;
  }

  drawPips() {
    this.valuePips.forEach(($valueDashPip, index) => {
      this.$element.append($valueDashPip);
      const valuePosition = `${this.getPositionByValue(this.values[index])}%`;
      $valueDashPip.css(
        this.orientation === 'horizontal' ? 'left' : 'top',
        `${valuePosition}`,
      );
      const isNotLast: boolean = this.valuePips.length - 1 !== index;
      if (isNotLast) {
        this.emptyPips.forEach(($emptyDashPip) => {
          const emptyValue = (this.values[index + 1] - this.values[index]) / 2 + this.values[index];
          const emptyPosition = `${this.getPositionByValue(emptyValue)}%`;
          this.$element.append($emptyDashPip.clone().css(
            this.orientation === 'horizontal' ? 'left' : 'top',
            emptyPosition,
          ));
        });
      }
    });
  }

  getValues(): number[] {
    const result: number[] = [this.range[0]];
    const difference: number = Math.round(this.diapason / (this.valuePipsNumber - 1));
    for (let i = 0; result.length < (this.valuePipsNumber); i += 1) {
      const newValue = result[i] + difference;
      result.push(newValue <= this.range[1] ? newValue : this.range[1]);
    }
    return result;
  }

  getPositionByValue(value: number): number {
    const result = (value - this.range[0]) / (this.range[1] - this.range[0]);
    return Math.round(result * 1e6) / 1e4;
  }

  handlerValuePipClick(event: JQuery.MouseEventBase) {
    event.stopPropagation();
    const value: number = $(event.target).hasClass('simple-range-slider__scale-pip-value')
      ? Number($(event.target).text())
      : Number($(event.target).siblings().text());
    this.callbackList.forEach((callback) => {
      callback({ value });
    });
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
