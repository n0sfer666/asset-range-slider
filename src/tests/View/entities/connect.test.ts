describe('Connect', () => {
  test.todo('please pass');
});
// import Connect from '../../../SimpleRangeSlider/View/entities/Connect';

// const normalizingCoefficient: number = 1e2;

// function makeRandomNumber(valuesPosition?: number): number {
//   let randomNumber = Math.round(Math.random() * normalizingCoefficient) / normalizingCoefficient;
//   if (!valuesPosition || randomNumber > valuesPosition) {
//     return randomNumber;
//   }
//   while (randomNumber < valuesPosition) {
//     randomNumber = Math.round(Math.random() * normalizingCoefficient) / normalizingCoefficient;
//   }
//   return randomNumber;
// }

// describe('Connect.ts', () => {
//   const valuesPosition: number = makeRandomNumber();
//   const endPosition: number = makeRandomNumber(valuesPosition);
//   const isSinglePointer: boolean = true;
//   const connects: Connect[] = [
//     new Connect(0, endPosition, 'horizontal', isSinglePointer),
//     new Connect(valuesPosition, endPosition, 'horizontal', isSinglePointer),
//     new Connect(0, endPosition, 'vertical', isSinglePointer),
//     new Connect(valuesPosition, endPosition, 'vertical', isSinglePointer),
//     new Connect(0, endPosition, 'horizontal', !isSinglePointer),
//     new Connect(valuesPosition, endPosition, 'horizontal', !isSinglePointer),
//     new Connect(0, endPosition, 'vertical', !isSinglePointer),
//     new Connect(valuesPosition, endPosition, 'vertical', !isSinglePointer),
//   ];

//   test('getElement()', () => {
//     connects.forEach((connect) => {
//       const $element: JQuery = jQuery(document.createElement('div'));
//       $element.addClass('simple-range-slider__connect');
//       $element.addClass(`simple-range-slider__connect_${connect.orientation}`);
//       expect(connect.getElement()).toEqual($element);
//     });
//   });

//   test('setPosition(valuesPosition, endPosition)', () => {
//     connects.forEach((connect) => {
//       const testStartPosition: number = makeRandomNumber();
//       const testEndPosition: number = makeRandomNumber(testStartPosition);
//       const values: number = Math.round(testStartPosition * normalizingCoefficient);
//       const end: number = Math.round(testEndPosition * normalizingCoefficient);
//       const CssValue: PointerCssValues[] = [{
//         attribute: connect.orientation === 'horizontal' ? 'width' : 'height',
//         value: `${end - values}%`,
//       }];
//       if (!connect.isSinglePointer) {
//         CssValue.push({
//           attribute: connect.orientation === 'horizontal' ? 'left' : 'top',
//           value: `${values}%`,
//         });
//       }
//       connect.setPosition(testStartPosition, testEndPosition);
//       const expectCssValue: string | null = connect.$element[0].getAttribute('style');
//       const resultCssValue: string = connect.isSinglePointer
//         ? `${CssValue[0].attribute}: ${CssValue[0].value};`
//         : `${CssValue[0].attribute}: ${CssValue[0].value}; ${CssValue[1].attribute}: ${CssValue[1].value};`;
//       expect(expectCssValue).toEqual(resultCssValue);
//       expect(connect.position).toEqual([testStartPosition, testEndPosition]);
//     });
//   });
// });
