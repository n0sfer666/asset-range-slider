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

  // test('create with incomplete config', () => {
  //   const testConfig: UserConfigList = {
  //     orientation: 'vertical',
  //     range: [-100, 100],
  //     scale: false,
  //   };
  //   const $slider = $container.simpleRangeSlider(testConfig);
  //   const config = <CompleteConfigList> $slider.data();
  //   const expectConfig = <CompleteConfigList> { ...defaultConfig, ...testConfig };
  //   expect($slider.length).toBeGreaterThan(0);
  //   expect(expectConfig).toEqual(config);
  // });

  // test('create with complete config', () => {
  //   const testConfig: CompleteConfigList = {
  //     orientation: 'vertical',
  //     values: [-10, 10],
  //     range: [-100, 100],
  //     step: 10,
  //     connect: false,
  //     tooltip: true,
  //     scale: false,
  //   };
  //   const $slider = $container.simpleRangeSlider(testConfig);
  //   const config = $slider.data();
  //   const expectConfig = { ...defaultConfig, ...testConfig };
  //   expect($slider.length).toBeGreaterThan(0);
  //   expect(expectConfig).toEqual(config);
  // });

  // test('create with input', () => {
  //   const testInput: JQuery = $(document.createElement('input'));
  //   const testConfig: UserConfigList = {
  //     input: {
  //       $tooltip: testInput,
  //     },
  //   };
  //   const $slider = $container.simpleRangeSlider(testConfig);
  //   const config = $slider.data();
  //   const expectConfig = { ...defaultConfig, ...testConfig };
  //   expect($slider.length).toBeGreaterThan(0);
  //   if (expectConfig.input && expectConfig.input.$tooltip) {
  //     expect(testInput.is(expectConfig.input.$tooltip)).toBe(true);
  //   } else {
  //     expect(expectConfig.input && expectConfig.input.$tooltip).toBe(true);
  //   }
  //   expect(!!config.input).toBe(false);
  // });
});
