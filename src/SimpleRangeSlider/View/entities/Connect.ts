class Connect {
  readonly className: string = 'simple-range-slider__connect';

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
    this.$element.addClass(this.className);
    this.$element.addClass(`${this.className}_${this.orientation}`);
  }

  setPosition(startPosition: number, endPosition: number, isSinglePointer?: boolean) {
    ['width', 'height', 'left', 'top'].forEach((attr) => {
      this.$element.css(attr, '');
    });
    this.isSinglePointer = isSinglePointer !== undefined ? isSinglePointer : this.isSinglePointer;
    const start: number = Math.round(startPosition * this.normalizingCoefficient);
    const end: number = Math.round(endPosition * this.normalizingCoefficient);
    this.$element.css(this.orientation === 'horizontal' ? 'width' : 'height', `${end - start}%`);
    if (!this.isSinglePointer) {
      this.$element.css(this.orientation === 'horizontal' ? 'left' : 'top', `${start}%`);
    }
    this.position = [startPosition, endPosition];
  }

  setOrientation(orientation: ConfigOrientation) {
    if (this.orientation !== orientation) {
      this.$element.removeClass(`${this.className}_${this.orientation}`);
      this.orientation = orientation;
      this.$element.addClass(`${this.className}_${this.orientation}`);
      this.setPosition(this.position[0], this.position[1]);
    }
  }
}

export default Connect;
