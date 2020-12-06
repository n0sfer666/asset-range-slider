import Connect from '../../SimpleRangeSlider/View/entities/Connect';

function makeRandomNumber(min: number, max: number): number {
  const tmpMin: number = Math.ceil(min);
  const tmpMax: number = Math.floor(max);
  return Math.round(Math.random() * (tmpMax - tmpMin + 1)) + tmpMin;
}

describe('Connect.ts', () => {
  const normalizingCoefficient: number = 1e-2;
  const startPosition: number = makeRandomNumber(0, 10000);
  const endPosition: number = makeRandomNumber(startPosition, 10000);
  const connects: Connect[] = [
    new Connect(0, endPosition, 'horizontal'),
    new Connect(startPosition, endPosition, 'horizontal'),
    new Connect(0, endPosition, 'vertical'),
    new Connect(startPosition, endPosition, 'vertical'),
  ];

  test('getElement()', () => {
    connects.forEach((connect) => {
      const $element: JQuery = jQuery(document.createElement('div'));
      $element.addClass('simple-range-slider__connect');
      $element.addClass(`simple-range-slider__connect_${connect.orientation}`);
      expect(connect.getElement()).toEqual($element);
    });
  });

  test('setPosition(startPosition, endPosition)', () => {
    connects.forEach((connect) => {
      const testStart: number = makeRandomNumber(0, 10000);
      const testEnd: number = makeRandomNumber(testStart, 10000);
      const start: number = Math.round(testStart * normalizingCoefficient);
      const end: number = Math.round(testEnd * normalizingCoefficient);
      const CssValue: tCssValues[] = [{
        attribute: connect.orientation === 'horizontal' ? 'width' : 'height',
        value: `${end - start}%`,
      }];
      if (testStart !== 0) {
        CssValue.push({
          attribute: connect.orientation === 'horizontal' ? 'left' : 'top',
          value: `${start}%`,
        });
      }
      connect.setPosition(testStart, testEnd);
      const expectCssValue: string | null = connect.$element.get(0).getAttribute('style');
      const resultCssValue: string = CssValue.length === 1
        ? `${CssValue[0].attribute}: ${CssValue[0].value};`
        : `${CssValue[0].attribute}: ${CssValue[0].value}; ${CssValue[1].attribute}: ${CssValue[1].value};`;
      expect(expectCssValue).toEqual(resultCssValue);
      expect(connect.position).toEqual([testStart, testEnd]);
    });
  });
});
