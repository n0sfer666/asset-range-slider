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

  const emptyPipsNumber = 2;
  const orientations: ConfigOrientation[] = ['horizontal', 'vertical'];
  const scales: Scale[] = orientations.map(
    (orientation, index) => new Scale([-((index + 1) * 1e3), (index + 1) * 1e3], orientation),
  );
  let callbackValue = NaN;
  const testCallback: ScaleCallback = (scaleData) => {
    callbackValue = scaleData.value;
  };

  test('subscribeOn(callback)', () => {
    scales.forEach((scale) => {
      scale.subscribeOn(testCallback);
      const expectCallback = JSON.stringify(testCallback);
      expect(expectCallback).toEqual(JSON.stringify(scale.callbackList[0]));
    });
  });

  test('getElement()', () => {
    const className = 'testClassName';
    const modifier = 'testModifier';
    const $expectElement = jQuery(`<div class = '${className}'></div>`);
    const $expectElementWithModifier = $expectElement.clone().addClass(
      `${className}_${modifier}`,
    );
    expect($expectElement.get(0)).toEqual(Scale.getElement(className).get(0));
    expect($expectElementWithModifier.get(0)).toEqual(Scale.getElement(className, modifier).get(0));
  });

  test('getDiapason()', () => {
    scales.forEach((scale) => {
      const expectDiapason = scale.range[1] - scale.range[0];
      expect(expectDiapason).toBe(scale.getDiapason());
    });
  });

  test('getValues()', () => {
    scales.forEach((scale) => {
      const difference = Math.round(scale.diapason / (valuePipsNumber - 1));
      const expectedValues = new Array(valuePipsNumber).fill(scale.range[0]).map((value, index) => {
        const newVal = value + difference * index;
        return newVal <= scale.range[1] ? newVal : scale.range[1];
      });
      expect(expectedValues).toEqual(scale.getValues());
    });
  });

  test('getEmptyPips()', () => {
    const expectedEmptyPips: JQuery[] = new Array(emptyPipsNumber).fill(
      Scale.getElement(classes.pip).append(Scale.getElement(classes.pipDash, 'empty')),
    );
    expect(expectedEmptyPips[0].get(0)).toEqual(scales[0].getEmptyPips()[0].get(0));
    expect(expectedEmptyPips.length).toBe(emptyPipsNumber);
  });

  test('getEmptyValues()', () => {
    scales.forEach((scale) => {
      const expectEmptyValues: number[] = [];
      scale.values.forEach((value, index) => {
        const isNotLast = index !== scale.values.length - 1;
        if (isNotLast) {
          const difference = (scale.values[index + 1] - value) / (emptyPipsNumber + 1);
          new Array(emptyPipsNumber)
            .fill(difference)
            .forEach((val, i) => expectEmptyValues.push(Math.round(value + val * (i + 1))));
        }
      });
      expect(expectEmptyValues).toEqual(scale.getEmptyValues());
    });
  });

  test('getValuePips()', () => {
    scales.forEach((scale) => {
      const expectValuePips = scale.values.map(() => {
        const $dash = Scale.getElement(classes.pipDash);
        const $pipValue = Scale.getElement(`${classes.pipValue} js-${classes.pipValue}`);
        return Scale.getElement(classes.pip).append(
          scale.orientation === 'horizontal' ? [$dash, $pipValue] : [$pipValue, $dash],
        );
      });
      const receivedValuePips = scale.getValuePips();
      expectValuePips.forEach((expectValuePip, index) => {
        expect(expectValuePip.get(0)).toEqual(receivedValuePips[index].get(0));
      });
    });
  });

  test('getPositionByValue(value)', () => {
    scales.forEach((scale) => {
      const testValue = makeRandomNumber(scale.range[0], scale.range[1]);
      const testPosition = (testValue - scale.range[0]) / (scale.range[1] - scale.range[0]);
      const expectPosition = Math.round(testPosition * 1e6) / 1e4;
      expect(expectPosition).toBe(scale.getPositionByValue(testValue));
    });
  });

  test('setPipPosition($pip, value)', () => {
    scales.forEach((scale) => {
      const $testPip = jQuery('<div></div>');
      const testValue = makeRandomNumber(scale.range[0], scale.range[1]);
      const attribute = `${scale.orientation === 'horizontal' ? 'left' : 'top'}`;
      const expectedStyle = `${attribute}: ${scale.getPositionByValue(testValue)}%;`;
      scale.setPipPosition($testPip, testValue);
      expect(expectedStyle).toBe($testPip.attr('style'));
    });
  });

  test('setOrientation(orientation)', () => {
    orientations.forEach((orientation) => {
      scales[1].setOrientation(orientation);
      expect(scales[1].$element.hasClass(`${classes.root}_${orientation}`));
    });
  });

  test('updatePips()', () => {
    scales.forEach((scale) => {
      const attr = scale.orientation === 'horizontal' ? 'left' : 'top';
      expect(scale.emptyPips.length).toBeGreaterThan(emptyPipsNumber);
      scale.emptyPips.forEach(($pip, index) => {
        const expectStyle = `${attr}: ${scale.getPositionByValue(scale.emptyValues[index])}%;`;
        expect(expectStyle).toBe($pip.attr('style'));
      });
      scale.valuePips.forEach(($pip, index) => {
        const expectStyle = `${attr}: ${scale.getPositionByValue(scale.values[index])}%;`;
        expect(expectStyle).toBe($pip.attr('style'));
      });
    });
  });

  test('drawPips()', () => {
    scales.forEach((scale) => {
      scale.valuePips.forEach(($pip) => {
        expect(scale.$element.find($pip).length).toBeGreaterThan(0);
      });
      scale.emptyPips.forEach(($pip) => {
        expect(scale.$element.find($pip).length).toBeGreaterThan(0);
      });
      const pipAmount = valuePipsNumber + valuePipsNumber * emptyPipsNumber - emptyPipsNumber;
      expect(pipAmount).toBe(scale.$element.children().length);
    });
  });

  test('updateScale(newRange, newOrientation?)', () => {
    scales.forEach((scale) => {
      const newRange: ConfigRange = [
        makeRandomNumber(-1e4, -1e3),
        makeRandomNumber(1e3, 1e4),
      ];
      const oppositeOrientation = scale.orientation === 'horizontal' ? 'vertical' : 'horizontal';
      const newOrientation = makeRandomNumber(0, 1)
        ? oppositeOrientation
        : undefined;
      const spyGetDiapason = jest.spyOn(scale, 'getDiapason');
      const spyGetValues = jest.spyOn(scale, 'getValues');
      const spyGetEmptyValues = jest.spyOn(scale, 'getEmptyValues');
      const spyUpdatePips = jest.spyOn(scale, 'updatePips');
      const spySetOrientation = jest.spyOn(scale, 'setOrientation');
      scale.updateScale(newRange, newOrientation);
      expect(spyGetDiapason).toBeCalled();
      expect(spyGetValues).toBeCalled();
      expect(spyGetEmptyValues).toBeCalled();
      expect(spyUpdatePips).toBeCalled();
      if (newOrientation) {
        expect(spySetOrientation).toBeCalled();
      } else {
        expect(spySetOrientation).not.toBeCalled();
      }
    });
  });

  test('handlerValuePipClick(event)', () => {
    scales.forEach((scale) => {
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
