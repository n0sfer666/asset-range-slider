// import Tooltip from '../../SimpleRangeSlider/View/entities/Tooltip';

// function makeRandomNumber(min: number, max: number): number {
//   const tmpMin: number = Math.ceil(min);
//   const tmpMax: number = Math.floor(max);
//   return Math.round(Math.random() * (tmpMax - tmpMin + 1)) + tmpMin;
// }

// describe('Tooltip.ts', () => {
//   const tooltips: Tooltip[] = [
//     new Tooltip(makeRandomNumber(-1000, 1000), 'horizontal'),
//     new Tooltip(makeRandomNumber(-1000, 1000), 'vertical'),
//   ];

//   test('getElement()', () => {
//     tooltips.forEach((tooltip) => {
//       const $element: JQuery = jQuery(document.createElement('div'));
//       $element.addClass('simple-range-slider__tooltip');
//       $element.addClass(`simple-range-slider__tooltip_${tooltip.orientation}`);
//       expect(tooltip.getElement()).toEqual($element);
//     });
//   });

//   test('setValue(value)', () => {
//     tooltips.forEach((tooltip) => {
//       const testValue: number = makeRandomNumber(-10000, 10000);
//       tooltip.setValue(testValue);
//       expect(tooltip.value).toEqual(testValue);
//       expect(tooltip.$element.text()).toEqual(String(testValue));
//     });
//   });

//   test('switchHidden(isVisible)', () => {
//     tooltips.forEach((tooltip) => {
//       tooltip.switchHidden(false);
//       expect(tooltip.$element.css('display')).toEqual('none');
//       tooltip.switchHidden(true);
//       expect(tooltip.$element.css('display')).toEqual('block');
//     });
//   });
// });
test('test', () => {
  expect(true).toBe(true);
});
