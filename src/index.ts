import './style/main.scss';
import SimpleRangeSlider from './SimpleRangeSlider/SimpleRangeSlider';

// eslint-disable-next-line func-names
(function ($: JQueryStatic) {
  $.fn.extend({
    simpleRangeSlider(config: iConfigUser) {
      // eslint-disable-next-line no-unused-vars
      const slider = new SimpleRangeSlider(<JQuery> this, <iConfigUser> config);
      return this;
    },
  });
}(jQuery));

jQuery(document).ready(() => {
});
