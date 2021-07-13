import Connect from '../../SimpleRangeSlider/View/entities/Connect';
import InputCheckboxTooltip from '../../SimpleRangeSlider/View/entities/inputs/InputCheckboxTooltip';
import InputTextValue from '../../SimpleRangeSlider/View/entities/inputs/InputTextValue';
import Pointer from '../../SimpleRangeSlider/View/entities/Pointer';
import Scale from '../../SimpleRangeSlider/View/entities/Scale';
import Tooltip from '../../SimpleRangeSlider/View/entities/Tooltip';
import View from '../../SimpleRangeSlider/View/View';
import makeRandomNumber from '../makeRandomNumber';

describe('View.ts', () => {
  const normalizingCoefficient = 1e4;
  const $body = $(document.body);
  const getRandomBoolean = () => Math.round(Math.random()) === 1;
  const getPositionFromValue = (values: number[], range: ConfigRange) => values.map((value) => {
    const result = (value - range[0]) / (range[1] - range[0]);
    return Math.round(result * normalizingCoefficient) / normalizingCoefficient;
  });
  const randomBoolean = getRandomBoolean();
  const $testContainer = $(document.createElement('div'));
  const testConfig: ConfigViewList = {
    connect: getRandomBoolean(),
    scale: getRandomBoolean(),
    tooltip: getRandomBoolean(),
    orientation: getRandomBoolean() ? 'horizontal' : 'vertical',
    range: [
      makeRandomNumber(-1e4, -1e3),
      makeRandomNumber(1e3, 1e4),
    ],
    start: [makeRandomNumber(-1e3, -1)],
    input: {
      values: [$(document.createElement('input')).prop('type', 'text')],
      $tooltip: $(document.createElement('input')).prop('type', 'checkbox'),
    },
  };
  if (randomBoolean) {
    testConfig.start.push(makeRandomNumber(0, 1e3));
    if (testConfig.input && testConfig.input.values) {
      testConfig.input.values.push($(document.createElement('input')).prop('type', 'text'));
    }
  }

  $body.append($testContainer);
  if (testConfig.input) {
    if (testConfig.input.values) {
      testConfig.input.values.forEach(($value: JQuery) => $body.append($value));
    }
    if (testConfig.input.$tooltip) {
      $body.append(testConfig.input.$tooltip);
    }
  }

  const testPositions = getPositionFromValue(testConfig.start, testConfig.range);
  const testInstance = new View($testContainer, testConfig, testPositions);

  let tesViewData: ViewData = {
    index: -1,
    position: -1,
    value: -1e5,
  };

  test('subscribeOn(callback)', () => {
    const testViewCallback: ViewCallback = (viewData: ViewData) => {
      tesViewData = viewData;
    };
    testInstance.subscribeOn(testViewCallback);
    expect(testViewCallback).toEqual(testInstance.callbackList[0]);
  });

  test('getSliderElement(isContainer)', () => {
    [true, false].forEach((isContainer) => {
      const className = isContainer ? 'slider' : 'slider-container';
      const $expectElement = $(document.createElement('div'))
        .addClass(`simple-range-slider__${className}`)
        .addClass(`simple-range-slider__${className}_${testConfig.orientation}`);
      expect($expectElement).toEqual(testInstance.getSliderElement(isContainer));
    });
  });

  test('getPointer(position, index)', () => {
    const position = Math.round(Math.random() * normalizingCoefficient) / normalizingCoefficient;
    const index = Math.round(Math.random());
    const testPointer = testInstance.getPointer(position, index);
    expect(testInstance.getPointer(position, index) instanceof Pointer).toBe(true);
    expect(testPointer.callbackList[0]).toEqual(testInstance.updateByPointer);
  });

  test('getTooltip(value)', () => {
    const testValue = makeRandomNumber(-1e3, 1e3);
    expect(testInstance.getTooltip(testValue) instanceof Tooltip).toBe(true);
  });

  test('getConnect', () => {
    const { pointers, isSinglePointer } = testInstance;
    const { orientation } = testConfig;
    const expectConnect = pointers.length === 1
      ? new Connect(0, pointers[0].position, orientation, isSinglePointer)
      : new Connect(pointers[0].position, pointers[1].position, orientation, isSinglePointer);
    expect(expectConnect).toEqual(testInstance.getConnect(pointers));
  });

  test('getScale()', () => {
    const testScale = testInstance.getScale();
    expect(testScale instanceof Scale).toBe(true);
    expect(testScale.callbackList[0]).toEqual(testInstance.updateByScale);
  });

  test('initInputs()', () => {
    const { inputValues, inputTooltip, updateByInputText } = testInstance;
    if (inputValues) {
      inputValues.forEach((inputValue) => {
        expect(inputValue instanceof InputTextValue).toBe(true);
        expect(inputValue.callbackList[0]).toEqual(updateByInputText);
      });
    }
    if (inputTooltip) {
      expect(inputTooltip instanceof InputCheckboxTooltip).toBe(true);
    }
  });

  test('drawSlider()', () => {
    const {
      pointers, tooltips, connect, scale, $sliderContainer, $slider, $container,
    } = testInstance;
    const { orientation } = testConfig;
    expect($container.find($sliderContainer).length).toBe(1);
    expect($sliderContainer.find($slider).length).toBe(1);
    if (scale) {
      expect($sliderContainer.find(scale.$element).length).toBe(1);
      if (orientation === 'vertical') {
        expect(scale.$element.index()).toBe(0);
      } else {
        expect(scale.$element.index()).toBe(1);
      }
    }
    if (connect) {
      expect($slider.find(connect?.$element).length).toBe(1);
    }
    pointers.forEach((pointer, index) => {
      if (tooltips) {
        expect(pointer.$element.find(tooltips[index].$element).length).toBe(1);
      }
      expect($slider.find(pointer.$element).length).toBe(1);
    });
  });

  test('switchActivePointer()', () => {
    const { pointers, activePointerIndex } = testInstance;
    pointers.forEach((pointer, index) => {
      expect(pointer.$element.hasClass(`${pointer.className}_active`))
        .toBe(index === activePointerIndex);
    });
  });

  test('updateByPointer(pointerData)', () => {
    const position = Math.round(Math.random() * normalizingCoefficient) / normalizingCoefficient;
    const index = Math.round(Math.random());
    const expectPointerData: PointerData = {
      position,
      index,
    };
    testInstance.updateByPointer(expectPointerData);
    expect(expectPointerData.index).toEqual(tesViewData.index);
    expect(expectPointerData.position).toEqual(tesViewData.position);
  });

  test('updateByInputText(inputTextData)', () => {
    const { range } = testConfig;
    const value = makeRandomNumber(range[0], range[1]);
    const index = Math.round(Math.random());
    const tesInputTextData: InputTextData = {
      value,
      index,
    };
    testInstance.updateByInputText(tesInputTextData);
    expect(testInstance.activePointerIndex).toBe(index);
    expect(tesInputTextData.value).toBe(tesViewData.value);
    expect(tesInputTextData.index).toBe(tesViewData.index);
  });

  test('updateByScale(scaleData)', () => {
    const { isSinglePointer, positions } = testInstance;
    let index = -1;
    const position = Math.round(Math.random() * normalizingCoefficient) / normalizingCoefficient;
    const tesScaleData: ScaleData = {
      position,
    };
    if (isSinglePointer) {
      index = 0;
    } else {
      const difference = positions.map((currentPosition) => {
        const result = Math.round((position - currentPosition) * normalizingCoefficient)
          / normalizingCoefficient;
        return Math.abs(result);
      });
      index = difference[0] < difference[1] ? 0 : 1;
      testInstance.updateByScale(tesScaleData);
      expect(index).toBe(tesViewData.index);
      expect(position).toBe(tesViewData.position);
    }
  });

  test('updateByModel(modelData)', () => {
    const {
      pointers, inputValues, tooltips, connect, isSinglePointer,
    } = testInstance;
    const index = isSinglePointer
      ? 0
      : Math.round(Math.random());
    const values = isSinglePointer
      ? [makeRandomNumber(-1e3, 1e3)]
      : [makeRandomNumber(-1e3, -1), makeRandomNumber(0, 1e3)];
    const positions = getPositionFromValue(values, testConfig.range);
    const tesModelData: ModelData = {
      index, positions, values,
    };
    const inputValueSetNewValue = inputValues
      ? jest.spyOn(inputValues[index], 'setNewValue')
      : jest.fn();
    const tooltipSetValue = tooltips
      ? jest.spyOn(tooltips[index], 'setValue')
      : jest.fn();
    const connectSetPosition = connect
      ? jest.spyOn(connect, 'setPosition')
      : jest.fn();
    const pointerSetPosition = jest.spyOn(pointers[index], 'setPosition');
    testInstance.updateByModel(tesModelData);
    if (inputValues) {
      expect(inputValueSetNewValue).toHaveBeenCalled();
      inputValueSetNewValue.mockRestore();
    }
    if (tooltips) {
      expect(tooltipSetValue).toHaveBeenCalled();
      tooltipSetValue.mockRestore();
    }
    if (connect) {
      expect(connectSetPosition).toHaveBeenCalled();
      connectSetPosition.mockRestore();
    }
    expect(pointerSetPosition).toHaveBeenCalled();
    pointerSetPosition.mockRestore();
    expect(testInstance.activePointerIndex).toBe(index);
    expect(testInstance.positions).toBe(positions);
    expect(testInstance.values).toBe(values);
  });
});
