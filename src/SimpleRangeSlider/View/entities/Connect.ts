class Connect {
  startPosition: number;

  endPosition: number;

  orientation: ConfigOrientation;

  isSinglePointer: boolean;

  $element: JQuery;

  position: [number, number];

  readonly normalizingCoefficient: number = 1e2;

  constructor(
    startPosition: number,
    endPosition: number,
    orientation: ConfigOrientation,
    isSinglePointer: boolean,
  ) {
    this.startPosition = startPosition;
    this.endPosition = endPosition;
    this.orientation = orientation;
    this.isSinglePointer = isSinglePointer;
    this.initElement();
    this.position = [this.startPosition, this.endPosition];
    this.setPosition(this.startPosition, this.endPosition);
  }

  initElement() {
    this.$element = jQuery(document.createElement('div'));
    this.$element.addClass('simple-range-slider__connect');
    this.$element.addClass(`simple-range-slider__connect_${this.orientation}`);
  }

  setPosition(startPosition: number, endPosition: number) {
    const start: number = Math.round(startPosition * this.normalizingCoefficient);
    const end: number = Math.round(endPosition * this.normalizingCoefficient);
    this.$element.css(this.orientation === 'horizontal' ? 'width' : 'height', `${end - start}%`);
    if (!this.isSinglePointer) {
      this.$element.css(this.orientation === 'horizontal' ? 'left' : 'top', `${start}%`);
    }
    this.position = [startPosition, endPosition];
  }
}

export default Connect;
