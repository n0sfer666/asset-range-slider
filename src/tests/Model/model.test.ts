import Model from '../../SimpleRangeSlider/Model/Model';
import makeRandomNumber from '../makeRandomNumber';

describe('Model.ts', () => {
  let testModelData: tModelData = {
    index: -1e8,
    positions: [-1e8],
    values: [-1e8],
  };
  const normalizingCoefficient = 1e4;
  const testCallback: iModelCallback = (modelData: tModelData) => {
    testModelData = modelData;
  };
  const testConfigs: iConfigModel[] = [
    {
      range: [-10, 100],
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
      const { range } = modelInstance;
      const testPositions = testConfigs[index].start.map((value) => {
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
    testModels.forEach((modelInstance) => {
      const { range } = modelInstance;
      const testValues = modelInstance.positions.map((position) => {
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
      const testValue = makeRandomNumber(range[0] - 5, range[1] + 5);
      const testViewData: tViewData[] = [
        {
          position: testPosition,
          index: Math.round(Math.random()),
        },
        {
          value: testValue,
          index: Math.round(Math.random()),
        },
      ];
      testViewData.forEach((viewData) => {
        let expectResult: number = 0;
        const { index, position, value } = viewData;
        const [rangeStart, rangeEnd] = range;
        const newValue = value || modelInstance.getValueFromPosition(position || NaN);
        const isTwoPointerSlider = modelInstance.values[1] !== undefined;
        const rightBoundary = modelInstance.values[1] - modelInstance.step;
        const leftBoundary = modelInstance.values[0] + modelInstance.step;
        const isValueOfLeftPointerBiggerThanRight = newValue > rightBoundary;
        const isValueOfRightPointerSmallerThanLeft = newValue < leftBoundary;
        if (index === 0 && isTwoPointerSlider) {
          expectResult = isValueOfLeftPointerBiggerThanRight
            ? rightBoundary
            : newValue;
        }
        if (index === 1) {
          expectResult = isValueOfRightPointerSmallerThanLeft
            ? leftBoundary
            : newValue;
        }
        if (index === 0 && !isTwoPointerSlider) {
          expectResult = newValue;
        }
        if (position) {
          if (position <= 0) {
            expectResult = rangeStart;
          }
          if (position >= 1) {
            expectResult = rangeEnd;
          }
        }
        if (value) {
          if (value <= range[0]) {
            expectResult = rangeStart;
          }
          if (value >= range[1]) {
            expectResult = rangeEnd;
          }
        }
        const testResult = modelInstance.getNewValue(viewData);
        expect(expectResult).toBe(testResult);
      });
    });
  });

  test('setValueAndPosition(newValue, index)', () => {
    testModels.forEach((modelInstance) => {
      const {
        values, step, positions, range,
      } = modelInstance;
      const maxIndex = values.length - 1;
      const randomIndex = Math.round(Math.random());
      const index = randomIndex <= maxIndex ? randomIndex : maxIndex;
      const newValue = makeRandomNumber(range[0] * 1.5, range[1] * 1.5);
      const leftBoundary = values[index] - (step / 2);
      const rightBoundary = values[index] + (step / 2);
      const isOutOfRange = newValue < range[0] || newValue > range[1];
      const isOutOfBoundary = newValue >= rightBoundary || newValue <= leftBoundary;
      const expectValue = !isOutOfRange && isOutOfBoundary
        ? Math.round(newValue / step) * step
        : values[index];
      const expectPosition = !isOutOfRange && isOutOfBoundary
        ? modelInstance.getPositionFromValue(expectValue)
        : positions[index];
      modelInstance.setValueAndPosition(newValue, index);
      expect(expectValue).toBe(modelInstance.values[index]);
      expect(expectPosition).toBe(modelInstance.positions[index]);
    });
  });

  test('updateByView(viewData)', () => {
    testModels.forEach((modelInstance) => {
      const { range, values } = modelInstance;
      const testPosition = Math.round(
        Math.random() * normalizingCoefficient,
      ) / normalizingCoefficient + makeRandomNumber(-1, 1);
      const testValue = makeRandomNumber(range[0] - 5, range[1] + 5);
      const maxIndex = values.length - 1;
      const randomIndex = Math.round(Math.random());
      const testIndex = randomIndex <= maxIndex ? randomIndex : maxIndex;
      const testViewData: tViewData[] = [
        {
          position: testPosition,
          index: testIndex,
        },
        {
          value: testValue,
          index: testIndex,
        },
      ];
      testViewData.forEach((viewData) => {
        const { index } = viewData;
        const newValue = modelInstance.getNewValue(viewData);
        modelInstance.setValueAndPosition(newValue, index);
        modelInstance.updateByView(viewData);
        const expectResult: tModelData = {
          positions: modelInstance.positions,
          values: modelInstance.values,
          index,
        };
        expect(expectResult).toEqual(testModelData);
      });
    });
  });
});
