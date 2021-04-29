import Panel from '../../../DemoPanel/entities/Panel';

describe('Panel.ts', () => {
  const testConfig: iCompleteConfig = {
    orientation: 'horizontal',
    start: [10],
    range: [0, 100],
    step: 10,
    connect: true,
    tooltip: true,
    scale: true,
  };
  const testInstance = new Panel(testConfig);

  test('getInputs()', () => {
    const {
      start, step, range, scale, connect, tooltip,
    } = testConfig;
    const expectInputs: iInputs = {
      $control: start.map((value, index) => testInstance.getConfigInputElement(value, index)),
      $orientation: [
        testInstance.getRadioElement('horizontal', 'orientation', testInstance.isHorizontal),
        testInstance.getRadioElement('vertical', 'orientation', !testInstance.isHorizontal),
      ],
      $range: range.map((value, index) => testInstance.getConfigInputElement(value, index, 'range')),
      $start: start.map((value, index) => testInstance.getConfigInputElement(value, index, 'start')),
      $step: [testInstance.getConfigInputElement(step, 0, 'step')],
      $scale: [
        testInstance.getRadioElement('enable', 'scale', scale),
        testInstance.getRadioElement('disable', 'scale', !scale),
      ],
      $connect: [
        testInstance.getRadioElement('enable', 'connect', connect),
        testInstance.getRadioElement('disable', 'connect', !connect),
      ],
      $tooltip: [
        testInstance.getRadioElement('enable', 'tooltip', tooltip),
        testInstance.getRadioElement('disable', 'tooltip', !tooltip),
      ],
    };
    expect(expectInputs).toEqual(testInstance.getInputs());
  });

  test('getContainers()', () => {
    const expectContainers: iContainers = {
      $control: testInstance.getContainerElement(),
      $orientation: testInstance.getContainerElement(),
      $range: testInstance.getContainerElement(),
      $start: testInstance.getContainerElement(),
      $step: testInstance.getContainerElement(),
      $scale: testInstance.getContainerElement(),
      $connect: testInstance.getContainerElement(),
      $tooltip: testInstance.getContainerElement(),
    };
    expect(expectContainers).toEqual(testInstance.getContainers());
  });

  test('getMainContainers()', () => {
    const expectMainContainers: iMainContainers = {
      $main: testInstance.getContainerElement('main'),
      $slider: testInstance.getContainerElement('slider'),
      $config: testInstance.getContainerElement('config'),
    };
    expect(expectMainContainers).toEqual(testInstance.getMainContainers());
  });
});
