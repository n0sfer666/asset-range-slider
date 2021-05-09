import Connect from '../../../SimpleRangeSlider/View/entities/Connect';

const normalizingCoefficient: number = 1e2;

function makeRandomNumber(startPosition?: number): number {
  let randomNumber = Math.round(Math.random() * normalizingCoefficient) / normalizingCoefficient;
  if (!startPosition || randomNumber > startPosition) {
    return randomNumber;
  }
  while (randomNumber < startPosition) {
    randomNumber = Math.round(Math.random() * normalizingCoefficient) / normalizingCoefficient;
  }
  return randomNumber;
}

describe('Connect.ts', () => {
  const startPosition: number = makeRandomNumber();
  const endPosition: number = makeRandomNumber(startPosition);
  const isSinglePointer: boolean = true;
  const connects: Connect[] = [
    new Connect(0, endPosition, 'horizontal', isSinglePointer),
    new Connect(startPosition, endPosition, 'horizontal', isSinglePointer),
    new Connect(0, endPosition, 'vertical', isSinglePointer),
    new Connect(startPosition, endPosition, 'vertical', isSinglePointer),
    new Connect(0, endPosition, 'horizontal', !isSinglePointer),
    new Connect(startPosition, endPosition, 'horizontal', !isSinglePointer),
    new Connect(0, endPosition, 'vertical', !isSinglePointer),
    new Connect(startPosition, endPosition, 'vertical', !isSinglePointer),
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
      const testStartPosition: number = makeRandomNumber();
      const testEndPosition: number = makeRandomNumber(testStartPosition);
      const start: number = Math.round(testStartPosition * normalizingCoefficient);
      const end: number = Math.round(testEndPosition * normalizingCoefficient);
      const CssValue: tCssValues[] = [{
        attribute: connect.orientation === 'horizontal' ? 'width' : 'height',
        value: `${end - start}%`,
      }];
      if (!connect.isSinglePointer) {
        CssValue.push({
          attribute: connect.orientation === 'horizontal' ? 'left' : 'top',
          value: `${start}%`,
        });
      }
      connect.setPosition(connect.startPosition, connect.endPosition);
      const expectCssValue: string | null = connect.$element[0].getAttribute('style');
      const resultCssValue: string = connect.isSinglePointer
        ? `${CssValue[0].attribute}: ${CssValue[0].value};`
        : `${CssValue[0].attribute}: ${CssValue[0].value}; ${CssValue[1].attribute}: ${CssValue[1].value};`;
      expect(expectCssValue).toEqual(resultCssValue);
      expect(connect.position).toEqual([testStartPosition, testEndPosition]);
    });
  });
});
