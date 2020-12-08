class Pointer {
  orientation: tOrientation;

  position: number;

  index: number;

  $element: JQuery;

  constructor(orientation: tOrientation, position: number, index: number) {
    this.orientation = orientation;
    this.position = position;
    this.index = index;
    this.$element = this.getElement();
    this.setPosition(this.position);
  }

  getElement(): JQuery {
    const $element: JQuery = jQuery(document.createElement('div'));
    $element.addClass('simple-range-slider__pointer');
    $element.addClass(`simple-range-slider__pointer_${this.orientation}`);
    return $element;
  }

  setPosition(position: number) {
    const liter: string = this.orientation === 'horizontal' ? 'X' : 'Y';
    this.$element.css('transform', `translate${liter}(${position}%)`);
    this.position = position;
  }

  getShift(event: MouseEvent): number {
    return this.orientation === 'horizontal'
      ? event.clientX - this.$element.position().left
      : event.clientY - this.$element.position().top;
  }
}

export default Pointer;
