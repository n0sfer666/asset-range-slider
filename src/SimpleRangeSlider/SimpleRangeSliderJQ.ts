import Presenter from './Controller/Presenter';

// eslint-disable-next-line func-names
(function ($: JQueryStatic) {
  $.fn.extend({
    simpleRangeSlider(userConfig: UserConfigList) {
      const $container = <JQuery> this;
      const dataConfig: UserConfigList = {};
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
      const config = <UserConfigList> { ...userConfig, ...dataConfig };
      const slider = new Presenter(<JQuery> this, <UserConfigList> config);
      const completeConfig = slider.getConfig();
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
