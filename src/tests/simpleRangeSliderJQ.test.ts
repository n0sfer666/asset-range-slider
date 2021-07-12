import '../SimpleRangeSlider/SimpleRangeSliderJQ';

describe('simpleRangeSliderJQ.ts', () => {
  const defaultConfig: CompleteConfigList = {
    orientation: 'horizontal',
    start: [10],
    range: [0, 100],
    step: 1,
    connect: true,
    scale: true,
    tooltip: true,
  };
  const $container = $(document.createElement('div')).addClass('js-slider');
  $(document.body).append($container);

  afterEach(() => {
    $container.empty();
    $container.removeData();
  });

  test('create with empty config', () => {
    const $slider = $container.simpleRangeSlider({});
    const config = $slider.data();
    expect($slider.length).toBeGreaterThan(0);
    expect(defaultConfig).toEqual(config);
  });

  test('create with incomplete config', () => {
    const testConfig: ConfigUserList = {
      orientation: 'vertical',
      range: [-100, 100],
      scale: false,
    };
    const $slider = $container.simpleRangeSlider(testConfig);
    const config = <CompleteConfigList> $slider.data();
    const expectConfig = <CompleteConfigList> { ...defaultConfig, ...testConfig };
    expect($slider.length).toBeGreaterThan(0);
    expect(expectConfig).toEqual(config);
  });

  test('create with complete config', () => {
    const testConfig: CompleteConfigList = {
      orientation: 'vertical',
      start: [-10, 10],
      range: [-100, 100],
      step: 10,
      connect: false,
      tooltip: true,
      scale: false,
    };
    const $slider = $container.simpleRangeSlider(testConfig);
    const config = $slider.data();
    const expectConfig = { ...defaultConfig, ...testConfig };
    expect($slider.length).toBeGreaterThan(0);
    expect(expectConfig).toEqual(config);
  });

  test('create with input', () => {
    const testInput: JQuery = $(document.createElement('input'));
    const testConfig: ConfigUserList = {
      input: {
        $tooltip: testInput,
      },
    };
    const $slider = $container.simpleRangeSlider(testConfig);
    const config = $slider.data();
    const expectConfig = { ...defaultConfig, ...testConfig };
    expect($slider.length).toBeGreaterThan(0);
    if (expectConfig.input && expectConfig.input.$tooltip) {
      expect(testInput.is(expectConfig.input.$tooltip)).toBe(true);
    } else {
      expect(expectConfig.input && expectConfig.input.$tooltip).toBe(true);
    }
    expect(!!config.input).toBe(false);
  });
});
