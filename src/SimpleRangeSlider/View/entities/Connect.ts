const classes = {
  root: 'simple-range-slider__connect',
};

class Connect {
  startPosition: number;

  endPosition: number;

  orientation: ConfigOrientation;

  isSinglePointer: boolean;

  $element: JQuery;

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
    this.setPosition(this.startPosition, this.endPosition, isSinglePointer);
  }

  initElement() {
    this.$element = jQuery('<div></div>', {
      class: `${classes.root} ${classes.root}_${this.orientation}`,
    });
  }

  setPosition(startPosition: number, endPosition: number, isSinglePointer?: boolean) {
    ['width', 'height', 'left', 'top'].forEach((attribute) => {
      this.$element.css(attribute, '');
    });
    this.isSinglePointer = isSinglePointer !== undefined ? isSinglePointer : this.isSinglePointer;
    const start: number = Math.round(startPosition * this.normalizingCoefficient);
    const end: number = Math.round(endPosition * this.normalizingCoefficient);
    this.$element.css(this.orientation === 'horizontal' ? 'width' : 'height', `${end - start}%`);
    if (!this.isSinglePointer) {
      this.$element.css(this.orientation === 'horizontal' ? 'left' : 'top', `${start}%`);
    }
    this.startPosition = startPosition;
    this.endPosition = endPosition;
  }

  setOrientation(orientation: ConfigOrientation) {
    if (this.orientation !== orientation) {
      this.$element.removeClass(`${classes.root}_${this.orientation}`);
      this.orientation = orientation;
      this.$element.addClass(`${classes.root}_${this.orientation}`);
      this.setPosition(this.startPosition, this.endPosition);
    }
  }
}

export default Connect;
