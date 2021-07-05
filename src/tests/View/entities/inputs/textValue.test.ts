import InputTextValue from '../../../../SimpleRangeSlider/View/entities/inputs/InputTextValue';
import makeRandomNumber from '../../../makeRandomNumber';

describe('InputTextValue.ts', () => {
  const $testElement = $(document.createElement('input')).prop('type', 'text');
  const testValue = makeRandomNumber(-1e4, 1e4);
  const testIndex = Math.round(Math.random());
  let tesInputTextData: InputTextData = {
    value: -1e8,
    index: -1e8,
  };
  const testCallback: InputTextCallback = (inputTextData) => {
    tesInputTextData = inputTextData;
  };
  const testInstance = new InputTextValue($testElement, testValue, testIndex);

  test('setNewValue(value)', () => {
    const expectValue = makeRandomNumber(1e5, 1e6);
    testInstance.setNewValue(expectValue);
    const elementValue = Number(testInstance.$element.val());
    expect(expectValue).toBe(elementValue);
    expect(expectValue).toBe(testInstance.value);
  });

  test('subscribeOn(callback)', () => {
    testInstance.subscribeOn(testCallback);
    expect(testCallback).toEqual(testInstance.callbackList[0]);
  });

  test('handleInputTextFocusout()', () => {
    const value = makeRandomNumber(1e6, 1e8);
    const expectData: InputTextData = {
      value,
      index: testIndex,
    };
    testInstance.$element.val(value);
    testInstance.$element.focusout();
    expect(expectData).toEqual(tesInputTextData);
  });
});
