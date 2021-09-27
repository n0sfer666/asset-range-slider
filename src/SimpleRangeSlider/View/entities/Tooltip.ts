const classes = {
  root: 'simple-range-slider__tooltip',
};

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
    this.$element = jQuery('<div></div>', {
      class: `${classes.root} ${classes.root}_${this.orientation}`,
    });
  }

  setValue(value: number) {
    this.value = value;
    this.$element.text(Math.round(value));
  }

  setOrientation(orientation: ConfigOrientation) {
    if (this.orientation !== orientation) {
      this.$element.removeClass(`${classes.root}_${this.orientation}`);
      this.orientation = orientation;
      this.$element.addClass(`${classes.root}_${this.orientation}`);
    }
  }
}

export default Tooltip;
