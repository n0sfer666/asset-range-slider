import Model from '../../SimpleRangeSlider/Model/Model';
import makeRandomNumber from '../makeRandomNumber';

describe('Model', () => {
  const model = new Model({});
  const defaultConfig: CompleteConfigList = {
    orientation: 'horizontal',
    values: [10],
    range: [0, 100],
    step: 1,
    withConnect: true,
    withTooltip: true,
    withScale: true,
  };
  const normalizingCoefficient = 1e4;
  let testPositions: PointerPosition = [-1];
  let testValues: PointerValue = [NaN];
  let testIndex: number = -1;
  const testCallback: ModelCallback = (modelData) => {
    testPositions = [...modelData.positions];
    testValues = [...modelData.values];
    testIndex = modelData.index;
  };

  test('getConfig()', () => {
    expect(defaultConfig).toEqual(model.getConfig());
  });

  test('getVerifiedConfig(userConfig)', () => {
    const testConfigs: CompleteConfigList[] = [
      {
        ...defaultConfig,
        step: makeRandomNumber(1, 10),
        values: [makeRandomNumber(-10, 10)],
        range: [makeRandomNumber(-100, -11), makeRandomNumber(11, 100)],
      },
      {
        ...defaultConfig,
        step: makeRandomNumber(1, 10),
        values: [makeRandomNumber(-10, 0), makeRandomNumber(1, 10)],
        range: [makeRandomNumber(-100, -11), makeRandomNumber(11, 100)],
      },
      {
        ...defaultConfig,
        step: makeRandomNumber(-100, 100),
        values: [makeRandomNumber(-100, 100)],
        range: [makeRandomNumber(-100, 100), makeRandomNumber(-100, 100)],
      },
      {
        ...defaultConfig,
        step: makeRandomNumber(-100, 100),
        values: [makeRandomNumber(-100, 100), makeRandomNumber(-100, 100)],
        range: [makeRandomNumber(-100, 100), makeRandomNumber(-100, 100)],
      },
    ];
    testConfigs.forEach((testConfig) => {
      const expectedConfig: CompleteConfigList = JSON.parse(JSON.stringify(testConfig));
      const { values, range } = testConfig;

      expectedConfig.step = testConfig.step > 0
        ? testConfig.step
        : defaultConfig.step;

      if (typeof expectedConfig.values[1] === 'number' && typeof values[1] === 'number') {
        expectedConfig.values[0] = values[0] >= range[0] && values[0] < expectedConfig.values[1]
          ? values[0]
          : range[0];
        expectedConfig.values[1] = values[1] > values[0] && values[1] <= range[1]
          ? values[1]
          : range[1];
      } else {
        expectedConfig.values[0] = values[0] >= range[0] && values[0] <= range[1]
          ? values[0]
          : range[0];
      }

      const isCorrectRange = typeof values[1] === 'number'
        ? range[0] <= values[0] && range[1] >= values[1] && range[1] > range[0]
        : range[0] <= values[0] && range[1] >= values[0] && range[1] > range[0];
      if (typeof values[1] === 'number') {
        expectedConfig.range = isCorrectRange
          ? range
          : [values[0] - 100, values[1] + 100];
      } else {
        expectedConfig.range = isCorrectRange
          ? range
          : [values[0] - 100, values[0] + 100];
      }

      expect(expectedConfig).toEqual(model.getVerifiedConfig(testConfig));
    });
  });

  test('getPosition()', () => {
    const expectedPositions = model.getConfig().values.map(
      (value) => model.getPositionFromValue(value),
    );
    expect(expectedPositions).toEqual(model.getPosition());
  });

  test('getPositionFromValue(value)', () => {
    const { range } = defaultConfig;
    const testValue = makeRandomNumber(range[0], range[1]);
    const result = (testValue - range[0]) / (range[1] - range[0]);
    const expectedValue = Math.round(result * normalizingCoefficient) / normalizingCoefficient;
    expect(expectedValue).toBe(model.getPositionFromValue(testValue));
  });

  test('getValueFromPosition(position)', () => {
    const { range } = defaultConfig;
    const testPosition = makeRandomNumber(0, normalizingCoefficient) / normalizingCoefficient;
    const expectPosition = Math.round((testPosition * (range[1] - range[0])) + range[0]);
    expect(expectPosition).toBe(model.getValueFromPosition(testPosition));
  });

  test('getNewValue(viewData)', () => {
    const testModels: Model[] = [
      new Model({}),
      new Model({values: [10, 90]}),
    ];
    testModels.forEach((testModel) => {
      const isSinglePointer = testModel.getConfig().values.length === 1;
      const { range, values, step } = testModel.getConfig();
      const testViewData: ViewData[] = [
        {
          activePointerIndex: isSinglePointer ? 0 : 1,
          position: (makeRandomNumber(0, normalizingCoefficient) / normalizingCoefficient),
        },
        {
          activePointerIndex: 0,
          position: (makeRandomNumber(0, normalizingCoefficient) / normalizingCoefficient),
        },
        {
          activePointerIndex: isSinglePointer ? 0 : 1,
          position: -1,
        },
        {
          activePointerIndex: isSinglePointer ? 0 : 1,
          position: 2,
        },
        {
          activePointerIndex: isSinglePointer ? 0 : 1,
          value: makeRandomNumber(range[0], range[1]),
        },
        {
          activePointerIndex: 0,
          value: makeRandomNumber(range[0], range[1]),
        },
        {
          activePointerIndex: isSinglePointer ? 0 : 1,
          value: range[0] - 1,
        },
        {
          activePointerIndex: isSinglePointer ? 0 : 1,
          value: range[1] + 1,
        },
      ];
      testViewData.forEach((viewData) => {
        const { activePointerIndex, position, value } = viewData;
        let newValue = NaN;
        if (typeof position === 'number') {
          newValue = testModel.getValueFromPosition(position);
        }
        if (typeof value === 'number') {
          newValue = value;
        }
        const isFirstOfNotSinglePointer = activePointerIndex === 0 && !isSinglePointer;
        if (isFirstOfNotSinglePointer && values[1]) {
          const boundary = values[1] - step;
          const isValueBiggerThanOther = boundary < newValue;
          newValue = isValueBiggerThanOther ? boundary : newValue;
        }
        if (activePointerIndex === 1) {
          const boundary = values[0] + step;
          const isValueBiggerThanOther = boundary > newValue;
          newValue = isValueBiggerThanOther ? boundary : newValue;
        }
        if (typeof position === 'number') {
          if (position <= 0) {
            newValue = range[0];
          }
          if (position >= 1) {
            newValue = range[1];
          }
        }
        if (typeof value === 'number') {
          if (value <= range[0]) {
            newValue = range[0];
          }
          if (value >= range[1]) {
            newValue = range[1];
          }
        }
        expect(newValue).toBe(testModel.getNewValue(viewData));
      });
    });
  });
  test('getViewUpdateList(config)', () => {
    const lastConfig = JSON.parse(JSON.stringify(model.getConfig()));
    const testConfig: UserConfigList = {
      values: [50, 60],
      withTooltip: false,
      orientation: 'vertical',
    };
    const newConfig = model.getVerifiedConfig({...lastConfig, ...testConfig});
    const isSinglePointer = newConfig.values.length === 1;
    const expectViewUpdateList: ViewUpdateList = {
      ...newConfig,
      positions: <PointerPosition> newConfig.values.map(
        (value) => model.getPositionFromValue(value),
      ),
    };
    expect(expectViewUpdateList).toEqual(model.getViewUpdateList(testConfig));
    expect(isSinglePointer).toBe(false);
    expect(newConfig).toEqual(model.getConfig());
  });
  test('updateByView(viewData), setValueAndPosition(newValue, index)', () => {
    const testModels: Model[] = [
      new Model({}),
      new Model({values: [10, 90]}),
    ];
    testModels.forEach((testModel) => {
      testModel.subscribeOn(testCallback);
      const isSinglePointer = testModel.getConfig().values.length === 1;
      const { range, values, step } = testModel.getConfig();
      const testViewData: ViewData[] = [
        {
          activePointerIndex: isSinglePointer ? 0 : 1,
          position: (makeRandomNumber(0, normalizingCoefficient) / normalizingCoefficient),
        },
        {
          activePointerIndex: 0,
          position: (makeRandomNumber(0, normalizingCoefficient) / normalizingCoefficient),
        },
        {
          activePointerIndex: isSinglePointer ? 0 : 1,
          position: -1,
        },
        {
          activePointerIndex: isSinglePointer ? 0 : 1,
          position: 2,
        },
        {
          activePointerIndex: isSinglePointer ? 0 : 1,
          value: makeRandomNumber(range[0], range[1]),
        },
        {
          activePointerIndex: 0,
          value: makeRandomNumber(range[0], range[1]),
        },
        {
          activePointerIndex: isSinglePointer ? 0 : 1,
          value: range[0] - 1,
        },
        {
          activePointerIndex: isSinglePointer ? 0 : 1,
          value: range[1] + 1,
        },
      ];
      testViewData.forEach((viewData) => {
        const { activePointerIndex } = viewData;
        const newValue = testModel.getNewValue(viewData);
        const expectValues = [...testModel.getConfig().values];
        const expectPositions = [...testModel.getPosition()];
        const leftBoundary = values[activePointerIndex] - (step / 2);
        const rightBoundary = values[activePointerIndex] + (step / 2);
        const isOutOfBoundary = newValue >= rightBoundary || newValue <= leftBoundary;
        const resultValue = Math.round(newValue / step) * step;
        if (isOutOfBoundary) {
          expectValues[activePointerIndex] = resultValue;
          expectPositions[activePointerIndex] = testModel.getPositionFromValue(resultValue);
        }
        testModel.updateByView(viewData);
        expect(activePointerIndex).toBe(testIndex);
        expect(expectValues).toEqual(testValues);
        expect(expectValues).toEqual(testModel.getConfig().values);
        expect(expectPositions).toEqual(testPositions);
        expect(expectPositions).toEqual(testModel.getPosition());
      });
    });
  });
});
