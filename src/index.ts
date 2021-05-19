import DemoPanel from './components/demo-panel/demo-panel';
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
  const demoPanel: DemoPanel[] = [];
  const $demoPanels = $('.js-demo-panel');
  $.each($demoPanels, (_, element) => {
    demoPanel.push(new DemoPanel($(element)));
  });
});
