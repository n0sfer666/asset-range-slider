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

  describe('initElement()', () => {
    tooltips.forEach((tooltip) => {
      const $element: JQuery = jQuery('<div></div>', {
        class: `${classes.root} ${classes.root}_${tooltip.orientation}`,
      });
      test(`tooltips[${tooltips.indexOf(tooltip)}]: $element is as expected`, () => {
        tooltip.initElement();
        expect(tooltip.$element).toEqual($element);
      });
    });
  });

  describe('setValue(value)', () => {
    tooltips.forEach((tooltip) => {
      const testValue: number = makeRandomNumber(-1e4, 1e4);
      test(`tooltips[${tooltips.indexOf(tooltip)}]: tooltip.value is as expected`, () => {
        tooltip.setValue(testValue);
        expect(tooltip.value).toEqual(testValue);
      });
      test(`tooltips[${tooltips.indexOf(tooltip)}]: $element.text() is as expected`, () => {
        tooltip.setValue(testValue);
        expect(tooltip.$element.text()).toEqual(String(testValue));
      });
    });
  });

  describe('setOrientation(orientation)', () => {
    tooltips.forEach((tooltip) => {
      const orientations: ConfigOrientation[] = ['horizontal', 'vertical'];
      orientations.forEach((orientation) => {
        test(`tooltips[${tooltips.indexOf(tooltip)}]: the class of $element is as expected`, () => {
          tooltip.setOrientation(orientation);
          expect(tooltip.$element.hasClass(`${classes.root}_${orientation}`)).toBe(true);
        });
      });
    });
  });
});
