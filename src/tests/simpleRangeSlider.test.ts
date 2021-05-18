import SimpleRangeSlider from '../SimpleRangeSlider/SimpleRangeSlider';

describe('SimpleRangeSlider.ts', () => {
  const testConfig: iConfigUser = {
    orientation: 'vertical',
    range: [-1000, 1000],
    start: [-100, 500],
    step: 5,
  };

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
    orientation: testConfig.orientation || testDefaultConfig.orientation,
    start: testConfig.start || testDefaultConfig.start,
    range: testConfig.range || testDefaultConfig.range,
    step: testConfig.step || testDefaultConfig.step,
    connect: testConfig.connect || testDefaultConfig.connect,
    tooltip: testConfig.tooltip || testDefaultConfig.tooltip,
    scale: testConfig.scale || testDefaultConfig.scale,
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
    expect(SimpleRangeSlider.getDefaultConfig())
      .toEqual(testDefaultConfig);
  });

  test('getCompleteConfig(userConfig, defaultConfig)', () => {
    expect(SimpleRangeSlider.getCompleteConfig(testConfig, testDefaultConfig))
      .toEqual(testCompleteConfig);
  });

  test('getModelConfig(completeConfig)', () => {
    expect(SimpleRangeSlider.getModelConfig(testCompleteConfig))
      .toEqual(testModelConfig);
  });
  test('getViewConfig(completeConfig)', () => {
    expect(SimpleRangeSlider.getViewConfig(testCompleteConfig))
      .toEqual(testViewConfig);
  });
});
