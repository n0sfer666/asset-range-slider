import InputCheckboxTooltip from '../../../../SimpleRangeSlider/View/entities/inputs/InputCheckboxTooltip';
import Tooltip from '../../../../SimpleRangeSlider/View/entities/Tooltip';
import makeRandomNumber from '../../../makeRandomNumber';

describe('InputCheckboxTooltip.ts', () => {
  const $testElement: JQuery = $(document.createElement('input')).prop('type', 'checkbox');
  const testTooltips: Tooltip[] = [
    new Tooltip(makeRandomNumber(-1e4, -1), 'horizontal'),
    new Tooltip(makeRandomNumber(0, 1e4), 'horizontal'),
  ];
  const testInstance = new InputCheckboxTooltip($testElement, testTooltips);

  test('handleTooltipCheckboxChange()', () => {
    const { tooltips } = testInstance;
    tooltips.forEach((tooltip) => {
      testInstance.$element.click().change();
      const isChecked = testInstance.$element.is(':checked');
      expect(tooltip.$element.css('display')).toBe(isChecked ? 'block' : 'none');
    });
  });
});
