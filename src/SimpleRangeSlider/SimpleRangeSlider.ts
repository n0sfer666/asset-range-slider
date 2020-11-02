class SimpleRangeSlider {
  private container: JQuery;

  constructor(container: JQuery) {
    this.container = container;
    console.log(this.container);
    console.log('Simple Range Slider was initiated');
  }
}

export default SimpleRangeSlider;

(function ($: JQueryStatic) {
  $.fn.extend({
    SimpleRangeSlider() {
      return new SimpleRangeSlider(<JQuery> this);
    },
  });
}(jQuery));
