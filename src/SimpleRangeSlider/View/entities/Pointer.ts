class Pointer {
  private orientation: tOrientation;

  private position: number;

  private index: number;

  public $element: JQuery;

  private readonly normalizingCoefficient: number = 1e4;

  constructor(orientation: tOrientation, position: number, index: number) {
    this.orientation = orientation;
    this.position = position;
    this.index = index;
    this.$element = this.getElement();
    this.setPosition(this.position);
  }

  private getElement(): JQuery {
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
}

export default Pointer;
