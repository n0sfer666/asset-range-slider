class Tooltip {
  value: number;

  orientation: ConfigOrientation;

  $element: JQuery;

  constructor(value: number, orientation: ConfigOrientation) {
    this.value = value;
    this.orientation = orientation;
    this.$element = this.getElement();
    this.setValue(this.value);
  }

  getElement(): JQuery {
    const $element: JQuery = jQuery(document.createElement('div'));
    $element.addClass('simple-range-slider__tooltip');
    $element.addClass(`simple-range-slider__tooltip_${this.orientation}`);
    return $element;
  }

  setValue(value: number) {
    this.value = value;
    this.$element.text(Math.round(value));
  }

  switchHidden(isVisible: boolean) {
    if (isVisible) {
      this.$element.show();
    } else {
      this.$element.hide();
    }
  }
}

export default Tooltip;
