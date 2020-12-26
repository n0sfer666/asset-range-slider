class Scale {
  $element: JQuery;

  range: tRange;

  orientation: tOrientation;

  $emptyPips: JQuery[] = [];

  $valuePips: JQuery[] = [];

  constructor(range: tRange, orientation: tOrientation) {
    this.orientation = orientation;
    this.range = range;
    this.$element = this.getElement();
  }

  getElement(): JQuery {
    const element: JQuery = jQuery(document.createElement('div'));
    element.addClass('simple-range-slider__scale');
    element.addClass(`simple-range-slider__scale_${this.orientation}`);
    return element;
  }
}

export default Scale;
