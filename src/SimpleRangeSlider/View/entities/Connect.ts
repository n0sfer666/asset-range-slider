class Connect {
  startPosition: number;

  endPosition: number;

  orientation: tOrientation;

  $element: JQuery;

  position: [number, number];

  readonly normalizingCoefficient: number = 1e2;

  constructor(startPosition: number, endPosition: number, orientation: tOrientation) {
    this.startPosition = startPosition;
    this.endPosition = endPosition;
    this.orientation = orientation;
    this.$element = this.getElement();
    this.position = [this.startPosition, this.endPosition];
    this.setPosition(this.startPosition, this.endPosition);
  }

  getElement(): JQuery {
    const element: JQuery = jQuery(document.createElement('div'));
    element.addClass('simple-range-slider__connect');
    element.addClass(`simple-range-slider__connect_${this.orientation}`);
    return element;
  }

  setPosition(startPosition: number, endPosition: number) {
    const start: number = Math.round(startPosition * this.normalizingCoefficient);
    const end: number = Math.round(endPosition * this.normalizingCoefficient);
    const cssValues: tCssValues[] = [{
      attribute: this.orientation === 'horizontal' ? 'width' : 'height',
      value: `${end - start}%`,
    }];
    if (start !== 0) {
      cssValues.push({
        attribute: this.orientation === 'horizontal' ? 'left' : 'top',
        value: `${(start)}%`,
      });
    }
    cssValues.forEach((cssValue) => {
      this.$element.css(cssValue.attribute, cssValue.value);
    });
    this.position = [startPosition, endPosition];
  }
}

export default Connect;
