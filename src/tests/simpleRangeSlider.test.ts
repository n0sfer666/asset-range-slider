import SimpleRangeSlider from '../SimpleRangeSlider/SimpleRangeSlider';

describe('SimpleRangeSlider.ts', () => {
  const $testContainer: JQuery = $(document.createElement('div'));
  $(document.body).append($testContainer);
  const testConfig: iConfigUser = {
    orientation: 'vertical',
    range: [-1000, 1000],
    start: [-100, 500],
    step: 5,
  };

  const testInstance: SimpleRangeSlider = new SimpleRangeSlider($testContainer, testConfig);

  test('create class', () => {
    expect(testInstance instanceof SimpleRangeSlider).toBe(true);
  });

  test('getCompleteConfig(userConfig, defaultConfig)', () => {
    const testCompleteConfig: iCompleteConfig = <iCompleteConfig> {
      ...testInstance.defaultConfig, ...testInstance.userConfig,
    };
    expect(testInstance.getCompleteConfig())
      .toEqual(testCompleteConfig);
  });

  test('getModelConfig(completeConfig)', () => {
    const { start, range, step } = testInstance.completeConfig;
    const testModelConfig: iConfigModel = <iConfigModel> {
      start, range, step,
    };
    expect(testInstance.getModelConfig())
      .toEqual(testModelConfig);
  });

  test('getViewConfig(completeConfig)', () => {
    const {
      start, range, step, orientation, scale, connect, tooltip, input,
    } = testInstance.completeConfig;
    const testViewConfig: iConfigView = {
      start, range, step, orientation, scale, connect, tooltip, input,
    };
    expect(testInstance.getViewConfig())
      .toEqual(testViewConfig);
  });

  test('rebuildSlider(config)', () => {
    const testNewConfig: iCompleteConfig = {
      orientation: 'horizontal',
      range: [-100, 100],
      start: [10],
      step: 10,
      connect: false,
      scale: false,
      tooltip: false,
    };
    testInstance.rebuildSlider(testNewConfig);
    expect(testInstance instanceof SimpleRangeSlider);
    expect(testInstance.completeConfig).toEqual(testNewConfig);
  });
});
