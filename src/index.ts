import SimpleRangeSlider from './SimpleRangeSlider/SimpleRangeSlider';

function importAll(r: any) {
  r.keys().forEach(r);
}
importAll(require.context('./style', true, /\.scss/));
importAll(require.context('./components', true, /\.scss/));

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
