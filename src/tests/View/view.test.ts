import View from '../../SimpleRangeSlider/View/View';
import Pointer from '../../SimpleRangeSlider/View/entities/Pointer';

describe('View.ts', () => {
  document.body.innerHTML = '<div class="js-plugin-1"></div>'
    + '<div class="js-plugin-2"></div>'
    + '<input type="text" class="js-input-1">'
    + '<input type="text" class="js-input-2">'
    + '<input type="checkbox" class="js-input-check">';
  const normalizingCoefficient: number = 1e4;
  const $testContainer: JQuery[] = [$('.js-plugin-1'), $('.js-plugin-2')];
  const testInputs: tConfigInput = {
    $value: [$('.js-input-1'), $('.js-input-2')],
    $tooltip: [$('.js-input-check')],
  };
  const testConfig: iConfigView[] = [
    {
      orientation: 'horizontal',
      range: [-1000, 1000],
      start: [0],
      connect: true,
      scale: true,
      tooltip: true,
      input: testInputs,
    }, {
      orientation: 'vertical',
      range: [-1000, 1000],
      start: [-250, 250],
      connect: true,
      scale: true,
      tooltip: true,
      input: testInputs,
    },
  ];
  const testInstance: View[] = $testContainer.map(
    ($container, index) => new View($container, testConfig[index]),
  );

  const $testElementsSlider: JQuery[] = testConfig.map(
    (config) => $(document.createElement('div'))
      .addClass('simple-range-slider__slider')
      .addClass(`simple-range-slider__slider_${config.orientation}`),
  );
  const testPositions: number[][] = testConfig.map((config) => {
    const { range, start } = config;
    const positions: number[] = start.map((value) => ((value - range[0]) / (range[1] - range[0])));
    return positions.map((position) => Math.round(position * normalizingCoefficient));
  });
  const testPointer: Pointer[][] = testConfig
    .map((config, type) => testPositions[type]
      .map((position, index) => new Pointer(config.orientation, position, index)));

  test('getSlider()', () => {
    expect(testInstance[0].getSlider())
      .toEqual($testElementsSlider[0]);
    expect(testInstance[1].getSlider())
      .toEqual($testElementsSlider[1]);
  });

  test('getNormalizedPosition(position)', () => {
    const testPosition: number = Math.random();
    const expectResult: number = Math.round(testPosition * normalizingCoefficient);
    expect(testInstance[0].getNormalizedPosition(testPosition))
      .toEqual(expectResult);
    expect(testInstance[1].getNormalizedPosition(testPosition))
      .toEqual(expectResult);
  });

  test('getPointer(value, index)', () => {
    testInstance.forEach((instance, type) => {
      const pointer: Pointer[] = testConfig[type].start.map(
        (value, index) => instance.getPointer(value, index),
      );
      expect(pointer).toEqual(testPointer[type]);
    });
  });

  // test('drawSlider()', () => {
  //   $testContainer.forEach(($container, index) => {
  //     const $expectSlider: JQuery = $container.children();
  //     const $expectPointers: JQuery = $expectSlider.children();
  //     $.each($expectPointers, (key, pointer) => {
  //       expect($(pointer).is(testInstance[index].pointer[key].$element)).toBe(true);
  //     });
  //     expect($expectSlider.is(testInstance[index].$slider)).toBe(true);
  //   });
  // });
});
