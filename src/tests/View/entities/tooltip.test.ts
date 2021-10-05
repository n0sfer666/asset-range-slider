import Tooltip from '../../../SimpleRangeSlider/View/entities/Tooltip';
import makeRandomNumber from '../../makeRandomNumber';

describe('Tooltip.ts', () => {
  const tooltips: Tooltip[] = [
    new Tooltip(makeRandomNumber(-1e3, 1e3), 'horizontal'),
    new Tooltip(makeRandomNumber(-1e3, 1e3), 'vertical'),
  ];
  const classes = {
    root: 'simple-range-slider__tooltip',
  };

  test('initElement()', () => {
    tooltips.forEach((tooltip) => {
      const $element: JQuery = jQuery('<div></div>', {
        class: `${classes.root} ${classes.root}_${tooltip.orientation}`,
      });
      tooltip.initElement();
      expect(tooltip.$element).toEqual($element);
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

  test('setOrientation(orientation)', () => {
    tooltips.forEach((tooltip) => {
      const orientations: ConfigOrientation[] = ['horizontal', 'vertical'];
      orientations.forEach((orientation) => {
        tooltip.setOrientation(orientation);
        expect(tooltip.$element.hasClass(`${classes.root}_${orientation}`)).toBe(true);
      });
    });
  });
});
