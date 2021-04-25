import Tooltip from '../../../SimpleRangeSlider/View/entities/Tooltip';
import makeRandomNumber from '../../makeRandomNumber';

describe('Tooltip.ts', () => {
  const tooltips: Tooltip[] = [
    new Tooltip(makeRandomNumber(-1e3, 1e3), 'horizontal'),
    new Tooltip(makeRandomNumber(-1e3, 1e3), 'vertical'),
  ];

  test('getElement()', () => {
    tooltips.forEach((tooltip) => {
      const $element: JQuery = jQuery(document.createElement('div'));
      $element.addClass('simple-range-slider__tooltip');
      $element.addClass(`simple-range-slider__tooltip_${tooltip.orientation}`);
      expect(tooltip.getElement()).toEqual($element);
    });
  });

  test('setValue(value)', () => {
    tooltips.forEach((tooltip) => {
      const testValue: number = makeRandomNumber(-1e4, 1e4);
      tooltip.setValue(testValue);
      expect(tooltip.value).toEqual(testValue);
      expect(tooltip.$element.text()).toEqual(String(testValue));
    });
  });

  test('switchHidden(isVisible)', () => {
    tooltips.forEach((tooltip) => {
      tooltip.switchHidden(false);
      expect(tooltip.$element.css('display')).toEqual('none');
      tooltip.switchHidden(true);
      expect(tooltip.$element.css('display')).toEqual('block');
    });
  });
});
