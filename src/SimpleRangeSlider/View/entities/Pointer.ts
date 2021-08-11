class Pointer {
  readonly normalizingCoefficient: number = 1e4;

  $container: JQuery;

  orientation: ConfigOrientation;

  position: number;

  index: number;

  $element: JQuery;

  callbackList: PointerCallback[] = [];

  shift: number = 0;

  boundingClientRect: number = 0;

  containerOffsetSize: number = 0;

  className: string = 'simple-range-slider__pointer';

  constructor($container: JQuery, orientation: ConfigOrientation, position: number, index: number) {
    this.bindContext();
    this.$container = $container;
    this.orientation = orientation;
    this.position = position;
    this.index = index;
    this.initElement();
    this.setPosition(this.position);
    this.bindHandler();
  }

  initElement() {
    this.$element = jQuery(document.createElement('div'));
    this.$element.addClass(`${this.className}`);
    this.$element.addClass(`${this.className}_${this.orientation}`);
  }

  switchActive(isActive: boolean) {
    if (isActive) {
      this.$element.addClass(`${this.className}_active`);
    } else {
      this.$element.removeClass(`${this.className}_active`);
    }
  }

  subscribeOn(callback: PointerCallback) {
    this.callbackList.push(callback);
  }

  setPosition(position: number) {
    this.$element.css('transform', '');
    this.position = position;
    const liter: string = this.orientation === 'horizontal' ? 'X' : 'Y';
    this.$element.css('transform', `translate${liter}(${this.position * this.normalizingCoefficient}%)`);
  }

  getShift(event: JQuery.MouseEventBase): number {
    const elementOffset = this.$element.offset() || this.$element[0].getBoundingClientRect();
    return this.orientation === 'horizontal'
      ? event.clientX - elementOffset.left
      : event.clientY - elementOffset.top;
  }

  getNormalizePosition(position: number): number {
    return (Math.round(position * this.normalizingCoefficient) / this.normalizingCoefficient);
  }

  setOrientation(orientation: ConfigOrientation) {
    if (this.orientation !== orientation) {
      this.$element.removeClass(`${this.className}_${this.orientation}`);
      this.orientation = orientation;
      this.$element.addClass(`${this.className}_${this.orientation}`);
      this.setPosition(this.position);
    }
  }

  handlePointerMouseDown(event: JQuery.MouseEventBase) {
    event.preventDefault();
    this.shift = this.getShift(event);
    const containerOffset = this.$container.offset() || this.$container[0].getBoundingClientRect();
    this.boundingClientRect = this.orientation === 'horizontal'
      ? containerOffset.left
      : containerOffset.top;
    const outerWidth = this.$container.outerWidth() || this.$container[0].offsetWidth;
    const outerHeight = this.$container.outerHeight() || this.$container[0].offsetHeight;
    this.containerOffsetSize = this.orientation === 'horizontal'
      ? outerWidth
      : outerHeight;
    $(document).on('mousemove', this.handlePointerMove);
    $(document).on('mouseup', this.handlePointerMouseUp);
  }

  handlePointerMove(event: JQuery.MouseEventBase) {
    const cursorPosition: number = this.orientation === 'horizontal'
      ? event.clientX
      : event.clientY;
    const newPosition: number = cursorPosition - this.shift - this.boundingClientRect;
    const newPositionInPercent: number = newPosition / this.containerOffsetSize;
    this.position = this.getNormalizePosition(newPositionInPercent);
    const { index, position } = this;
    this.callbackList.forEach((callback) => callback({ index, position }));
  }

  handlePointerMouseUp() {
    $(document).off('mousemove', this.handlePointerMove);
    $(document).off('mouseup', this.handlePointerMouseUp);
  }

  bindContext() {
    this.handlePointerMouseDown = this.handlePointerMouseDown.bind(this);
    this.handlePointerMouseUp = this.handlePointerMouseUp.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
  }

  bindHandler() {
    this.$element.on('mousedown', this.handlePointerMouseDown);
  }
}

export default Pointer;
