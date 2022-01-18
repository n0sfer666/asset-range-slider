import Presenter from './SimpleRangeSlider/Presenter/Presenter';

const rSlider = Presenter;
$.fn.extend({
  simpleRangeSlider(userConfig?: UserConfigList) {
    const $container = <JQuery> this;
    const dataConfig: UserConfigList = {};
    $.each($container.data(), (key, value) => {
      if (key === 'values' || key === 'range') {
        const valueWithoutBracketsAndComma = String(value);
        valueWithoutBracketsAndComma.replace(/(\[|\]|\S)$/, '');
        const correctValue = valueWithoutBracketsAndComma.split(',').map((str) => Number(str));
        if (key === 'values') {
          dataConfig[key] = <PointerValue> correctValue;
        } else {
          dataConfig[key] = <ConfigRange> correctValue;
        }
      } else if (key === 'step' || key === 'orientation') {
        dataConfig[key] = value;
      } else {
        const correctKey = String(key).split('').map(
          (char, index) => (index === 4 ? char.toUpperCase() : char.toLowerCase()),
        ).join('');
        dataConfig[correctKey] = value;
      }
    });
    const config = <UserConfigList> { ...userConfig, ...dataConfig };
    const slider = new Presenter(<JQuery> this, <UserConfigList> config);
    const completeConfig = slider.getConfig();
    Object.keys(completeConfig).forEach((key) => {
      $container.attr(`data-${key}`, completeConfig[key]).data(key, completeConfig[key]);
    });
    $container.data('SimpleRangeSlider', slider);
    return $container;
  },
});

export default rSlider;
