class Scale {
  readonly valuePipsNumber: number = 5;

  readonly emptyPipsNumber: number = 3;

  $element: JQuery;

  range: tRange;

  orientation: tOrientation;

  $emptyDashPips: JQuery[] = [];

  $valueDashPips: JQuery[] = [];

  diapason: number;

  values: number[] = [];

  constructor(range: tRange, orientation: tOrientation) {
    this.orientation = orientation;
    this.range = range;
    this.diapason = this.range[1] - this.range[0];
    this.values = this.getValues();
    this.$element = this.getElement('scale', this.orientation);
    this.$emptyDashPips = this.getEmptyDashPips();
    this.$valueDashPips = this.getValueDashPips();
    this.drawPips();
  }

  getElement(elementName: string, modifier?: string): JQuery {
    const $element: JQuery = jQuery(document.createElement('div'));
    $element.addClass(`simple-range-slider__${elementName}`);
    if (modifier) {
      $element.addClass(`simple-range-slider__${elementName}_${modifier}`);
    }
    return $element;
  }

  getEmptyDashPips(): JQuery[] {
    const $EmptyDashPips: JQuery[] = [];
    for (let i = 0; i < this.emptyPipsNumber; i += 1) {
      const $emptyDash = this.getElement('scale-pip-dash', 'empty');
      $EmptyDashPips.push(this.getElement('scale-pip').append($emptyDash));
    }
    return $EmptyDashPips;
  }

  getValueDashPips(): JQuery[] {
    const $valueDashPips: JQuery[] = this.values.map((value) => {
      const $dash = this.getElement('scale-pip-dash');
      const $pipValue = this.getElement('scale-pip-value').text(value);
      return this.getElement('scale-pip').append($dash, $pipValue);
    });

    return $valueDashPips;
  }

  drawPips() {
    this.$valueDashPips.forEach(($valueDashPip, index) => {
      this.$element.append($valueDashPip);
      const isLast: boolean = this.$valueDashPips.length - 1 === index;
      if (!isLast) {
        this.$emptyDashPips.forEach(($emptyDashPip) => {
          this.$element.append($emptyDashPip.clone());
        });
      }
    });
  }

  getValues(): number[] {
    const result: number[] = [this.range[0]];
    const difference: number = Math.round(this.diapason / (this.valuePipsNumber - 1));
    for (let i = 0; result.length < (this.valuePipsNumber - 1); i += 1) {
      result.push(result[i] + difference);
    }
    result.push(this.range[1]);
    return result;
  }
}

export default Scale;
