import Presenter from '../SimpleRangeSlider/Presenter/Presenter';
import '../SimpleRangeSlider/SimpleRangeSliderJQ';

describe('simpleRangeSliderJQ.ts', () => {
  const defaultConfig: CompleteConfigList = {
    orientation: 'horizontal',
    values: [10],
    range: [0, 100],
    step: 1,
    withConnect: true,
    withScale: true,
    withTooltip: true,
  };
  const $container = $('<div></div>').appendTo(document.body);

  afterEach(() => {
    $container.empty();
    $container.removeData();
  });

  test('create with empty config', () => {
    const instance: Presenter = $container.simpleRangeSlider({}).data('SimpleRangeSlider');
    expect(instance instanceof Presenter).toBe(true);
    expect(instance.getConfig()).toEqual(defaultConfig);
  });

  test('create with config from .data()', () => {
    const testConfig: CompleteConfigList = {
      orientation: 'vertical',
      values: [-50, 50],
      range: [-500, 500],
      step: 10,
      withTooltip: false,
      withScale: true,
      withConnect: false,
    };
    Object.keys(testConfig).forEach((key) => {
      $container.data(key, testConfig[key]);
    });
    const instance: Presenter = $container.simpleRangeSlider({}).data('SimpleRangeSlider');
    expect(instance instanceof Presenter).toBe(true);
    expect(instance.getConfig()).toEqual(testConfig);
  });
});
