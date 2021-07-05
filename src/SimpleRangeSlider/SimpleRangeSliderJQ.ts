import SimpleRangeSlider from './SimpleRangeSlider';

// eslint-disable-next-line func-names
(function ($: JQueryStatic) {
  $.fn.extend({
    simpleRangeSlider(config: ConfigUserList) {
      // eslint-disable-next-line no-new
      new SimpleRangeSlider(<JQuery> this, <ConfigUserList> config);
      return this;
    },
  });
}(jQuery));
