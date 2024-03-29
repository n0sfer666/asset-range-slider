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
  let testPositions: PointerPosition = [NaN];
  let testValues: PointerValue = [NaN];
  let testIndex: number = NaN;
  const testCallback: ModelCallback = (modelData) => {
    testPositions = JSON.parse(JSON.stringify(modelData.positions));
    testValues = JSON.parse(JSON.stringify(modelData.values));
    testIndex = modelData.index;
  };

  describe('getConfig()', () => {
    test('return config', () => {
      expect(defaultConfig).toEqual(model.getConfig());
    });
  });

  describe('getVerifiedConfig(userConfig)', () => {
    const testConfigs: CompleteConfigList[] = [
      {
        ...defaultConfig,
        step: makeRandomNumber(-10, 0),
      },
      {
        ...defaultConfig,
        step: makeRandomNumber(101, 200),
      },
      {
        ...defaultConfig,
        step: makeRandomNumber(1, 100),
      },
      {
        ...defaultConfig,
        values: [makeRandomNumber(-100, -1)],
      },
      {
        ...defaultConfig,
        values: [makeRandomNumber(101, 200)],
      },
      {
        ...defaultConfig,
        values: [makeRandomNumber(0, 100)],
      },
      {
        ...defaultConfig,
        values: [makeRandomNumber(50, 100), makeRandomNumber(0, 49)],
      },
      {
        ...defaultConfig,
        values: [makeRandomNumber(0, 49), makeRandomNumber(50, 100)],
      },
      {
        ...defaultConfig,
        range: [makeRandomNumber(100, 200), makeRandomNumber(300, 400)],
      },
      {
        ...defaultConfig,
        range: [makeRandomNumber(-100, -200), makeRandomNumber(-300, -400)],
      },
      {
        ...defaultConfig,
        range: [makeRandomNumber(-100, 10), makeRandomNumber(11, 100)],
      },
    ];
    testConfigs.forEach((testConfig) => {
      const lastCorrectConfig = JSON.parse(JSON.stringify(model.getConfig()));
      const checks: boolean[] = [true];
      const { values, range } = testConfig;

      if (testConfig.step > 0 || testConfig.step <= (range[1] - range[0])) {
        checks.push(false);
      }

      if (typeof values[1] === 'number') {
        if (values[0] < range[0] || values[0] >= values[1]) {
          checks.push(false);
        }
        if (values[1] <= values[0] || values[1] > range[1]) {
          checks.push(false);
        } else if (values[0] < range[0] || values[0] > range[1]) {
          checks.push(false);
        }
      }
      const expectedConfig: CompleteConfigList = checks.reduce(
        (previousValue, currentValue) => previousValue && currentValue,
      )
        ? testConfig
        : lastCorrectConfig;
      test(`testConfigs[${testConfigs.indexOf(testConfig)}]: returned config is as expected`, () => {
        setTimeout(() => {
          expect(expectedConfig).toEqual(model.getVerifiedConfig(testConfig));
        }, 5);
      });
    });
  });

  describe('getPosition()', () => {
    const expectedPositions = model.getConfig().values.map(
      (value) => model.getPositionFromValue(value),
    );
    test('returned positions is as expected', () => {
      expect(expectedPositions).toEqual(model.getPosition());
    });
  });

  describe('getPositionFromValue(value)', () => {
    const { range } = defaultConfig;
    const testValue = makeRandomNumber(range[0], range[1]);
    const result = (testValue - range[0]) / (range[1] - range[0]);
    const expectedValue = Math.round(result * normalizingCoefficient) / normalizingCoefficient;
    test('returned position is as expected', () => {
      expect(expectedValue).toBe(model.getPositionFromValue(testValue));
    });
  });

  describe('getValueFromPosition(position)', () => {
    const { range } = defaultConfig;
    const testPosition = makeRandomNumber(0, normalizingCoefficient) / normalizingCoefficient;
    const expectPosition = Math.round((testPosition * (range[1] - range[0])) + range[0]);
    test('returned value is as expected', () => {
      expect(expectPosition).toBe(model.getValueFromPosition(testPosition));
    });
  });

  describe('getNewValue(viewData)', () => {
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
      describe(`testModels[${testModels.indexOf(testModel)}]`, () => {
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
          test(`testViewData[${testViewData.indexOf(viewData)}]`, () => {
            setTimeout(() => {
              expect(newValue).toBe(testModel.getNewValue(viewData));
            }, 5);
          });
        });
      });
    });
  });
  describe('getViewUpdateList(config)', () => {
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
    test('viewUpdateList is as expected', () => {
      expect(expectViewUpdateList).toEqual(model.getViewUpdateList(testConfig));
    });
    test('slider is not single pointer', () => {
      expect(isSinglePointer).toBe(false);
    });
    test('config is as expected', () => {
      expect(newConfig).toEqual(model.getConfig());
    });
  });
  describe('updateByView(viewData), setValueAndPosition(newValue, index)', () => {
    const testModels: Model[] = [
      new Model({}),
      new Model({values: [10, 90]}),
    ];
    testModels.forEach((testModel) => {
      testModel.subscribeOn(testCallback);
      const isSinglePointer = testModel.getConfig().values.length === 1;
      const { range } = testModel.getConfig();
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
      describe(`testModels[${testModels.indexOf(testModel)}]`, () => {
        testViewData.forEach((viewData) => {
          describe(`testViewData[${testViewData.indexOf(viewData)}]`, () => {
            const { values, step } = testModel.getConfig();
            const { activePointerIndex } = viewData;
            const newValue = testModel.getNewValue(viewData);
            const leftStep = values[activePointerIndex] - (step / 2);
            const rightStep = values[activePointerIndex] + (step / 2);
            const isOutOfStep = newValue >= rightStep || newValue <= leftStep;
            let isNotOutOfRange = newValue >= range[0] && newValue <= range[1];
            if (typeof (values[1]) === 'number') {
              isNotOutOfRange = activePointerIndex === 0
                ? newValue >= range[0] && newValue < values[1]
                : newValue > values[0] && newValue <= range[1];
            }
            const resultValue = Math.round(newValue / step) * step;
            const expectedValues = [...testModel.getConfig().values];
            const expectedPositions = [...testModel.getPosition()];
            if (isOutOfStep && isNotOutOfRange) {
              expectedValues[activePointerIndex] = resultValue;
              expectedPositions[activePointerIndex] = testModel.getPositionFromValue(resultValue);
            }
            beforeEach(() => {
              testModel.updateByView(viewData);
            });
            test('activePointerIndex is as expected', () => {
              expect(testIndex).toBe(activePointerIndex);
            });
            test('values is as expected', () => {
              setTimeout(() => {
                expect(testValues).toEqual(expectedValues);
              }, 5);
            });
            test('positions is as expected', () => {
              setTimeout(() => {
                expect(testPositions).toEqual(expectedPositions);
              }, 5);
            });
          });
        });
      });
    });
  });
});
