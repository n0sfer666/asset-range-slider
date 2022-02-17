import Scale from '../../../SimpleRangeSlider/View/entities/Scale';
import makeRandomNumber from '../../makeRandomNumber';

describe('Scale', () => {
  const classes = {
    root: 'simple-range-slider__scale',
    pip: 'simple-range-slider__scale-pip',
    pipDash: 'simple-range-slider__scale-pip-dash',
    pipValue: 'simple-range-slider__scale-pip-value',
  };
  const valuePipsNumber = 5;

  const orientations: ConfigOrientation[] = ['horizontal', 'vertical'];
  const ranges: ConfigRange[] = orientations.map(
    (_) => ([makeRandomNumber(-1e6, -1e4), makeRandomNumber(1e4, 1e6)]),
  );
  const steps: number[] = ranges.map((range) => makeRandomNumber(1, (range[1] / 2)));
  const scales: Scale[] = orientations.map(
    (orientation, index) => new Scale(ranges[index], orientation, steps[index]),
  );
  let callbackValue = NaN;
  const testCallback: ScaleCallback = (scaleData) => {
    callbackValue = scaleData.value;
  };

  describe('subscribeOn(callback)', () => {
    scales.forEach((scale) => {
      test(`scales[${scales.indexOf(scale)}] callback was added to callbackList`, () => {
        scale.subscribeOn(testCallback);
        expect(testCallback).toEqual((scale.callbackList[0]));
      });
    });
  });

  describe('getElement()', () => {
    const className = 'testClassName';
    const modifier = 'testModifier';
    const $expectElement = jQuery(`<div class = '${className}'></div>`);
    const $expectElementWithModifier = $expectElement.clone().addClass(
      `${className}_${modifier}`,
    );
    test('get correct element', () => {
      expect($expectElement.get(0)).toEqual(Scale.getElement(className).get(0));
    });
    test('get correct element with modifier', () => {
      expect($expectElementWithModifier.get(0))
        .toEqual(Scale.getElement(className, modifier).get(0));
    });
  });

  describe('getDiapason()', () => {
    scales.forEach((scale) => {
      test(`scales[${scales.indexOf(scale)}] get correct diapason`, () => {
        const expectDiapason = scale.range[1] - scale.range[0];
        expect(expectDiapason).toBe(scale.getDiapason());
      });
    });
  });

  describe('getValues()', () => {
    scales.forEach((scale) => {
      test(`scales[${scales.indexOf(scale)}] get correct values`, () => {
        const difference = Math.round(scale.diapason / (valuePipsNumber - 1));
        const expectedValues = new Array(valuePipsNumber).fill(scale.range[0]).map(
          (value, index) => {
            const newVal = value + difference * index;
            return newVal <= scale.range[1] ? newVal : scale.range[1];
          },
        );
        setTimeout(() => {
          expect(expectedValues).toEqual(scale.getValues());
        }, 5);
      });
    });
  });

  describe('getValuePips()', () => {
    scales.forEach((scale) => {
      describe(`scales[${scales.indexOf(scale)}]`, () => {
        const expectValuePips = scale.values.map(() => {
          const $dash = Scale.getElement(classes.pipDash);
          const $pipValue = Scale.getElement(`${classes.pipValue} js-${classes.pipValue}`);
          return Scale.getElement(classes.pip).append(
            scale.orientation === 'horizontal' ? [$dash, $pipValue] : [$pipValue, $dash],
          );
        });
        const receivedValuePips = scale.getValuePips();
        expectValuePips.forEach((expectValuePip, index) => {
          test(`valuePip[${index}] is correct`, () => {
            expect(expectValuePip.get(0)).toEqual(receivedValuePips[index].get(0));
          });
        });
      });
    });
  });

  describe('getPositionByValue(value)', () => {
    scales.forEach((scale) => {
      test(`scales[${scales.indexOf(scale)}] return position by value correct`, () => {
        const testValue = makeRandomNumber(scale.range[0], scale.range[1]);
        const testPosition = (testValue - scale.range[0]) / (scale.range[1] - scale.range[0]);
        const expectPosition = Math.round(testPosition * 1e6) / 1e4;
        expect(expectPosition).toBe(scale.getPositionByValue(testValue));
      });
    });
  });

  describe('setPipPosition($pip, value)', () => {
    scales.forEach((scale) => {
      test(`scales[${scales.indexOf(scale)}] set correct position in element style`, () => {
        const $testPip = jQuery('<div></div>');
        const testValue = makeRandomNumber(scale.range[0], scale.range[1]);
        const attribute = `${scale.orientation === 'horizontal' ? 'left' : 'top'}`;
        const expectedStyle = `${attribute}: ${scale.getPositionByValue(testValue)}%;`;
        scale.setPipPosition($testPip, testValue);
        expect(expectedStyle).toBe($testPip.attr('style'));
      });
    });
  });

  describe('setOrientation(orientation)', () => {
    orientations.forEach((orientation) => {
      test(`${orientation} orientation set correct`, () => {
        scales[1].setOrientation(orientation);
        expect(scales[1].$element.hasClass(`${classes.root}_${orientation}`)).toBe(true);
      });
    });
  });

  describe('updatePips()', () => {
    scales.forEach((scale) => {
      describe(`scales[${scales.indexOf(scale)}]`, () => {
        const attr = scale.orientation === 'horizontal' ? 'left' : 'top';
        scale.valuePips.forEach(($pip, index) => {
          test(`valuePips[${index}] style is correct`, () => {
            const expectStyle = `${attr}: ${scale.getPositionByValue(scale.values[index])}%;`;
            expect(expectStyle).toBe($pip.attr('style'));
          });
        });
      });
    });
  });

  describe('drawPips()', () => {
    scales.forEach((scale) => {
      describe(`scales[${scales.indexOf(scale)}]`, () => {
        scale.valuePips.forEach(($pip, index) => {
          test(`valuePips[${index}] was draw`, () => {
            expect(scale.$element.find($pip).length).toBeGreaterThan(0);
          });
        });
        test('pips amount is correct', () => {
          expect(scale.valuePips.length).toBeLessThanOrEqual(scale.$element.children().length);
        });
      });
    });
  });

  describe('updateScale(newRange, newOrientation?)', () => {
    scales.forEach((scale) => {
      describe(`scales[${scales.indexOf(scale)}]`, () => {
        const newRange: ConfigRange = [
          makeRandomNumber(-1e4, -1e3),
          makeRandomNumber(1e3, 1e4),
        ];
        const oppositeOrientation = scale.orientation === 'horizontal' ? 'vertical' : 'horizontal';
        const newOrientation = makeRandomNumber(0, 1)
          ? oppositeOrientation
          : undefined;
        let spies = {
          getDiapason: jest.spyOn(scale, 'getDiapason'),
          getValues: jest.spyOn(scale, 'getValues'),
          updatePips: jest.spyOn(scale, 'updatePips'),
          setOrientation: jest.spyOn(scale, 'setOrientation'),
        };
        beforeEach(() => {
          spies = {
            getDiapason: jest.spyOn(scale, 'getDiapason'),
            getValues: jest.spyOn(scale, 'getValues'),
            updatePips: jest.spyOn(scale, 'updatePips'),
            setOrientation: jest.spyOn(scale, 'setOrientation'),
          };
          scale.updateScale(newRange, newOrientation);
        });
        afterEach(() => {
          $.each(spies, (_, spy) => {
            spy.mockReset().mockRestore();
          });
        });
        test('getDiapason() was called', () => {
          expect(spies.getDiapason).toBeCalled();
        });
        test('getValues() was called', () => {
          expect(spies.getValues).toBeCalled();
        });
        test('updatePips() was called', () => {
          expect(spies.updatePips).toBeCalled();
        });
        if (newOrientation) {
          test(`newOrientation: ${newOrientation}. setOrientation(...) was called`, () => {
            expect(spies.setOrientation).toBeCalled();
          });
        } else {
          test(`newOrientation: ${newOrientation}. setOrientation(...) was NOT called`, () => {
            expect(spies.setOrientation).not.toBeCalled();
          });
        }
      });
    });
  });

  describe('handlerValuePipClick(event)', () => {
    scales.forEach((scale) => {
      test(`scales[${scales.indexOf(scale)}]: callback value is as expected`, () => {
        const randomIndex = makeRandomNumber(0, scale.valuePips.length - 1);
        const correctIndex = randomIndex <= scale.valuePips.length - 1
          ? randomIndex
          : scale.valuePips.length - 1;
        if (makeRandomNumber(0, 1)) {
          scale.valuePips[correctIndex].find(`.js-${classes.pipValue}`).click();
        } else {
          scale.valuePips[correctIndex].click();
        }
        setTimeout(() => {
          expect(callbackValue).toBe(scale.values[correctIndex]);
        }, 15);
      });
    });
  });
});
