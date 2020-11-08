import SimpleRangeSlider from '../SimpleRangeSlider/SimpleRangeSlider';

class DemoPanel {
  private container: JQuery;

  private config: iConfigUser;

  constructor(container: JQuery, config: iConfigUser) {
    this.container = container;
    this.config = config;
    const slider: SimpleRangeSlider = new SimpleRangeSlider(this.container, this.config);
    console.log('Demo Panel was initiated');
  }
}

export default DemoPanel;

(function ($: JQueryStatic) {
  $.fn.extend({
    DemoPanel(config: iConfigUser) {
      return new DemoPanel(<JQuery> this, <iConfigUser> config);
    },
  });
}(jQuery));
