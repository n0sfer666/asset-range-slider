import Tooltip from './Tooltip';

const classes = {
  root: 'simple-range-slider__pointer',
  active: 'simple-range-slider__pointer_active',
};

class Pointer {
  readonly normalizingCoefficient: number = 1e4;

  $container: JQuery;

  orientation: ConfigOrientation;

  position: number;

  index: number;

  withTooltip: boolean;

  tooltip?: Tooltip;

  $element: JQuery;

  callbackList: PointerCallback[] = [];

  shift: number = 0;

  boundingClientRect: number = 0;

  containerOffsetSize: number = 0;

  constructor(
    $container: JQuery,
    orientation: ConfigOrientation,
    position: number,
    index: number,
    withTooltip: boolean,
    value: number,
  ) {
    this.bindContext();
    this.$container = $container;
    this.orientation = orientation;
    this.position = position;
    this.index = index;
    this.withTooltip = withTooltip;
    this.initElement();
    this.initTooltip(value);
    this.setPosition(this.position);
    this.bindHandler();
  }

  initElement() {
    this.$element = jQuery('<div></div>', {
      class: `${classes.root} ${classes.root}_${this.orientation}`,
    });
  }

  initTooltip(value: number) {
    if (this.withTooltip) {
      this.tooltip = new Tooltip(value, this.orientation);
      this.tooltip.$element.appendTo(this.$element);
    }
  }

  updateTooltip(withTooltip: boolean, value: number) {
    this.withTooltip = withTooltip;
    if (this.withTooltip) {
      if (!this.tooltip) {
        this.tooltip = new Tooltip(value, this.orientation);
        this.tooltip.$element.appendTo(this.$element);
      } else {
        this.tooltip.setValue(value);
      }
    } else if (this.tooltip) {
      this.tooltip.$element.remove();
      this.tooltip = undefined;
    }
  }

  setPositionAndUpdateTooltip(position: number, withTooltip: boolean, value: number) {
    this.setPosition(position);
    this.updateTooltip(withTooltip, value);
  }

  switchActive(isActive: boolean) {
    if (isActive) {
      this.$element.addClass(`${classes.active}}`);
    } else {
      this.$element.removeClass(`${classes.active}`);
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
      this.$element.removeClass(`${classes.root}_${this.orientation}`);
      this.orientation = orientation;
      this.$element.addClass(`${classes.root}_${this.orientation}`);
      this.setPosition(this.position);
      if (this.tooltip) {
        this.tooltip.setOrientation(this.orientation);
      }
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
    this.callbackList.forEach((callback) => callback({
      index: this.index,
      position: this.position,
    }));
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
