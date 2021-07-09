import SimpleRangeSlider from './SimpleRangeSlider';

// eslint-disable-next-line func-names
(function ($: JQueryStatic) {
  $.fn.extend({
    simpleRangeSlider(config: ConfigUserList) {
      const slider = new SimpleRangeSlider(<JQuery> this, <ConfigUserList> config);
      const { $container, completeConfig } = slider;
      const configKeys: string[] = Object.keys(completeConfig);
      const indexOfInput = configKeys.indexOf('input');
      if (indexOfInput !== -1) {
        configKeys.splice(indexOfInput);
      }
      configKeys.forEach((key) => {
        $container.data(key, completeConfig[key]);
      });
      return this;
    },
  });
}(jQuery));
