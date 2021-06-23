import SimpleRangeSlider from './SimpleRangeSlider';

// eslint-disable-next-line func-names
(function ($: JQueryStatic) {
  $.fn.extend({
    simpleRangeSlider(config: iConfigUser) {
      // eslint-disable-next-line no-new
      new SimpleRangeSlider(<JQuery> this, <iConfigUser> config);
      return this;
    },
  });
}(jQuery));
