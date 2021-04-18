import Model from '../../SimpleRangeSlider/Model/Model';

function makeRandomNumber(min: number, max: number): number {
  const tmpMin: number = Math.ceil(min);
  const tmpMax: number = Math.floor(max);
  return Math.round(Math.random() * (tmpMax - tmpMin + 1)) + tmpMin;
}

describe('Model.ts', () => {
  let testModelData: tModelData = {
    index: 0,
    positions: [0],
    values: [0],
  };
  const normalizingCoefficient = 1e4;
  const testCallback: iModelCallback = (modelData: tModelData) => {
    testModelData = modelData;
  };
  // const viewData: tViewData[] = [
  //   {
  //     position: makeRandomNumber(-10, 0),
  //     index: makeRandomNumber(0, 1),
  //   },
  //   {
  //     position: makeRandomNumber(0, 10),
  //     index: makeRandomNumber(0, 1),
  //   },
  //   {
  //     position: Math.round(Math.random() * normalizingCoefficient) / normalizingCoefficient,
  //     index: makeRandomNumber(0, 1),
  //   },
  //   {
  //     value: makeRandomNumber(-1e6, -1e5),
  //     index: makeRandomNumber(0, 1),
  //   },
  //   {
  //     value: makeRandomNumber(1e6, 1e5),
  //     index: makeRandomNumber(0, 1),
  //   }
  // ]
  const testConfigs: iConfigModel[] = [
    {
      range: [0, 100],
      start: [50],
      step: 1,
    },
    {
      range: [-1000, 1000],
      start: [-500, 500],
      step: 10,
    },
  ];
  const testModels: Model[] = testConfigs.map((config) => new Model(config));

  test('subscribeOn(callback)', () => {
    testModels.forEach((modelInstance) => {
      modelInstance.subscribeOn(testCallback);
      expect(testCallback).toEqual(modelInstance.callbackList[0]);
    });
  });

  test('getPositionFromValue(value)', () => {
    testModels.forEach((modelInstance, index) => {
      const testPositions = testConfigs[index].start.map((value) => {
        const { range } = testConfigs[index];
        const result = (value - range[0]) / (range[1] - range[0]);
        return Math.round(result * normalizingCoefficient) / normalizingCoefficient;
      });
      const expectPositions = testConfigs[index].start.map(
        (value) => modelInstance.getPositionFromValue(value),
      );
      expect(expectPositions).toEqual(testPositions);
    });
  });

  test('getValueFromPosition(value)', () => {
    testModels.forEach((modelInstance, index) => {
      const testValues = modelInstance.positions.map((position) => {
        const { range } = testConfigs[index];
        const result = (position * (range[1] - range[0]) + range[0]);
        return Math.round(result);
      });
      const expectValues = modelInstance.positions.map(
        (position) => modelInstance.getValueFromPosition(position),
      );
      expect(expectValues).toEqual(testValues);
    });
  });

  test('getNewValue(viewData)', () => {
    testModels.forEach((modelInstance) => {
      const { range } = modelInstance;
      const testPosition = Math.round(
        Math.random() * normalizingCoefficient,
      ) / normalizingCoefficient + makeRandomNumber(-1, 1);
      const testValue = makeRandomNumber(range[0] * 1.5, range[1] * 1.5);
      const testViewData: tViewData[] = [
        {
          position: testPosition,
          index: makeRandomNumber(0, 1),
        },
        {
          value: testValue,
          index: makeRandomNumber(0, 1),
        },
      ];
      testViewData.forEach((viewData) => {
        let expectResult: number = 0;
        const { index, position, value } = viewData;
        if (position === 0) {
          expectResult = range[0];
        }
        if (position === 1) {
          expectResult = range[1];
        }
        const newValue = value || modelInstance.getValueFromPosition(position || NaN);
        const isTwoPointerSlider = modelInstance.value[1] !== undefined;
        const rightBoundary = modelInstance.value[1] - modelInstance.step;
        const leftBoundary = modelInstance.value[0] + modelInstance.step;
        const isValueOfLeftPointerBiggerThanRight = newValue > rightBoundary;
        const isValueOfRightPointerSmallerThanLeft = newValue < leftBoundary;
      });
    });
  });
});
