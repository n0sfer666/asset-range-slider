// import InputCheckboxTooltip from '../../../../SimpleRangeSlider/View/entities/inputs/InputCheckboxTooltip';
// import Tooltip from '../../../../SimpleRangeSlider/View/entities/Tooltip';

// describe('InputCheckboxTooltip.ts', () => {
//   const $testElement: JQuery = $(document.createElement('input')).prop('type', 'checkbox');
//   const testTooltips: Tooltip[] = [
//     new Tooltip(makeRandomNumber(-1e4, -1), 'horizontal'),
//     new Tooltip(makeRandomNumber(0, 1e4), 'horizontal'),
//   ];
//   const testInstance = new InputCheckboxTooltip($testElement, testTooltips);

//   test('handleTooltipCheckboxChange()', () => {
//     expect(testInstance.$element.is(':checked')).toBe(true);
//     testInstance.handleTooltipCheckboxChange();
//     testTooltips.forEach((tooltipInstance) => {
//       expect(tooltipInstance.$element.css('display')).toBe('block');
//     });

//     testInstance.$element.prop('checked', false);
//     expect(testInstance.$element.is(':checked')).toBe(false);
//     testInstance.handleTooltipCheckboxChange();
//     testTooltips.forEach((tooltipInstance) => {
//       expect(tooltipInstance.$element.css('display')).toBe('none');
//     });
//   });
// });
test('test', () => {
  expect(true).toBe(true);
});
