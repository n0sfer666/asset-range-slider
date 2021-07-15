import SimpleRangeSlider from './SimpleRangeSlider';

// eslint-disable-next-line func-names
(function ($: JQueryStatic) {
  $.fn.extend({
    simpleRangeSlider(userConfig: ConfigUserList) {
      const $container = <JQuery> this;
      const dataConfig: ConfigUserList = {};
      $.each($container.data(), (key, value) => {
        if (key === 'start' || key === 'range') {
          const valueWithoutBracketsAndComma = String(value);
          valueWithoutBracketsAndComma.replace(/(\[|\]|\S)$/, '');
          const correctValue = valueWithoutBracketsAndComma.split(',').map((str) => Number(str));
          if (key === 'start') {
            dataConfig[key] = <PointerValue> correctValue;
          } else {
            dataConfig[key] = <ConfigRange> correctValue;
          }
        } else {
          dataConfig[key] = value;
        }
      });
      const config = <ConfigUserList> { ...userConfig, ...dataConfig };
      const slider = new SimpleRangeSlider(<JQuery> this, <ConfigUserList> config);
      const { completeConfig } = slider;
      const configKeys: string[] = Object.keys(completeConfig);
      const indexOfInput = configKeys.indexOf('input');
      if (indexOfInput !== -1) {
        configKeys.splice(indexOfInput);
      }
      configKeys.forEach((key) => {
        $container.attr(`data-${key}`, completeConfig[key]);
      });
      $container.data('config', completeConfig);
      $container.data('instance', slider);
      return $container;
    },
  });
}(jQuery));
