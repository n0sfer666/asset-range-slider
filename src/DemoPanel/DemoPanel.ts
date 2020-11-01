import SimpleRangeSlider from '../SimpleRangeSlider/SimpleRangeSlider';

class DemoPanel {
  private container: JQuery;

  constructor(container: JQuery) {
    this.container = container;
    const slider: SimpleRangeSlider = new SimpleRangeSlider(this.container);
    console.log('Demo Panel was initiated');
  }
}

export default DemoPanel;

(function ($: JQueryStatic) {
  $.fn.extend({
    DemoPanel() {
      return new DemoPanel(<JQuery>this);
    },
  });
}(jQuery));