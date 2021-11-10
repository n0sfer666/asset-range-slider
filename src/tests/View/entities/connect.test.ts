import Connect from '../../../SimpleRangeSlider/View/entities/Connect';
import makeRandomNumber from '../../makeRandomNumber';

describe('Connect.ts', () => {
  const classes = {
    root: 'simple-range-slider__connect',
  };
  const normalizingValue: number = 1e2;
  const positions = [
    makeRandomNumber(0, normalizingValue / 2 - 1) / normalizingValue,
    makeRandomNumber(normalizingValue / 2, normalizingValue) / normalizingValue,
  ];
  const orientations: ConfigOrientation[] = ['horizontal', 'vertical'];
  const connects: Connect[] = [true, false, true, false, false, false].map(
    (isSinglePointer, index) => (index < 4
      ? new Connect(
        0,
        positions[1],
        index % 2 === 0 ? orientations[0] : orientations[1],
        isSinglePointer,
      )
      : new Connect(
        positions[0],
        positions[1],
        index % 2 === 0 ? orientations[0] : orientations[1],
        isSinglePointer,
      )),
  );

  describe('setPosition(startPosition, endPosition, isSinglePointer?)', () => {
    connects.forEach((connect) => {
      const startPosition = connect.isSinglePointer
        ? 0
        : makeRandomNumber(0, normalizingValue / 2 - 1) / normalizingValue;
      const endPosition = connect.isSinglePointer
        ? makeRandomNumber(0, normalizingValue / 2 - 1) / normalizingValue
        : makeRandomNumber(normalizingValue / 2, normalizingValue) / normalizingValue;
      const start = Math.round(startPosition * normalizingValue);
      const end = Math.round(endPosition * normalizingValue);
      const expectCss = [
        {
          attr: connect.orientation === 'horizontal' ? 'width' : 'height',
          value: `${end - start}%`,
        },
      ];
      if (!connect.isSinglePointer) {
        expectCss.push({
          attr: connect.orientation === 'horizontal' ? 'left' : 'top',
          value: `${start}%`,
        });
      }
      let expectStyle = `${expectCss[0].attr}: ${expectCss[0].value};`;
      if (!connect.isSinglePointer) {
        expectStyle += ` ${expectCss[1].attr}: ${expectCss[1].value};`;
      }
      connect.setPosition(startPosition, endPosition);
      test(`connect[${connects.indexOf(connect)}]: the style of the element is as expected`, () => {
        expect(expectStyle).toBe(connect.$element.attr('style'));
      });
    });
  });

  describe('initElement()', () => {
    connects.forEach((connect, index) => {
      if (index < 2) {
        const $element = jQuery('<div></div>', {
          class: `${classes.root} ${classes.root}_${connect.orientation}`,
        });
        const backupPositions = [connect.startPosition, connect.endPosition];
        test(`connect[${connects.indexOf(connect)}]: the element is as expected`, () => {
          connect.initElement();
          expect($element).toEqual(connect.$element);
        });
        connect.setPosition(backupPositions[0], backupPositions[1]);
      }
    });
  });

  describe('setOrientation()', () => {
    connects.forEach((connect) => {
      orientations.forEach((orientation) => {
        test(`connect[${connects.indexOf(connect)}]: the class of the element is as expected`, () => {
          connect.setOrientation(orientation);
          expect(connect.$element.hasClass(`${classes.root}_${orientation}`)).toBe(true);
        });
      });
    });
  });
});
