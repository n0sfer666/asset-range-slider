class Tooltip {
  value: number;

  orientation: ConfigOrientation;

  $element: JQuery;

  constructor(value: number, orientation: ConfigOrientation) {
    this.value = value;
    this.orientation = orientation;
    this.initElement();
    this.setValue(this.value);
  }

  initElement() {
    this.$element = jQuery(document.createElement('div'));
    this.$element.addClass('simple-range-slider__tooltip');
    this.$element.addClass(`simple-range-slider__tooltip_${this.orientation}`);
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
