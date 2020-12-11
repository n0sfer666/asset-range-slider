import SimpleRangeSlider from '../SimpleRangeSlider/SimpleRangeSlider';

describe('SimpleRangeSlider.ts', () => {
  document.body.innerHTML = '<div class="js-plugin"></div>'
    + '<input type="text" class="js-input-1">'
    + '<input type="text" class="js-input-2">'
    + '<input type="checkbox" class="js-input-check">';
  const testContainer: JQuery = $('.js-plugin');
  const testInputs: tConfigInput = {
    $value: [$('.js-input-1'), $('.js-input-2')],
    $tooltip: [$('.js-input-check')],
  };
  const testConfig: iConfigUser = {
    orientation: 'vertical',
    range: [-1000, 1000],
    start: [-100, 500],
    step: 5,
    input: testInputs,
  };
  const testInstance: SimpleRangeSlider = new SimpleRangeSlider(testContainer, testConfig);

  const testDefaultConfig: iCompleteConfig = {
    orientation: 'horizontal',
    start: [10],
    range: [0, 100],
    step: 1,
    connect: true,
    tooltip: true,
    scale: true,
  };
  const testCompleteConfig: iCompleteConfig = {
    orientation: testConfig.orientation === undefined
      ? testDefaultConfig.orientation
      : testConfig.orientation,
    start: testConfig.start === undefined
      ? testDefaultConfig.start
      : testConfig.start,
    range: testConfig.range === undefined
      ? testDefaultConfig.range
      : testConfig.range,
    step: testConfig.step === undefined
      ? testDefaultConfig.step
      : testConfig.step,
    connect: testConfig.connect === undefined
      ? testDefaultConfig.connect
      : testConfig.connect,
    tooltip: testConfig.tooltip === undefined
      ? testDefaultConfig.tooltip
      : testConfig.tooltip,
    scale: testConfig.scale === undefined
      ? testDefaultConfig.scale
      : testConfig.scale,
    input: testConfig.input,
  };
  const testModelConfig: iConfigModel = {
    range: testCompleteConfig.range,
    start: testCompleteConfig.start,
    step: testCompleteConfig.step,
  };
  const testViewConfig: iConfigView = {
    orientation: testCompleteConfig.orientation,
    start: testCompleteConfig.start,
    range: testCompleteConfig.range,
    tooltip: testCompleteConfig.tooltip,
    connect: testCompleteConfig.connect,
    scale: testCompleteConfig.scale,
    input: testCompleteConfig.input,
  };

  test('getDefaultConfig()', () => {
    expect(testInstance.getDefaultConfig())
      .toEqual(testDefaultConfig);
  });

  test('getCompleteConfig(userConfig, defaultConfig)', () => {
    expect(testInstance.getCompleteConfig(testConfig, testDefaultConfig))
      .toEqual(testCompleteConfig);
  });

  test('getModelConfig(completeConfig)', () => {
    expect(testInstance.getModelConfig(testCompleteConfig))
      .toEqual(testModelConfig);
  });
  test('getViewConfig(completeConfig)', () => {
    expect(testInstance.getViewConfig(testCompleteConfig))
      .toEqual(testViewConfig);
  });
});
