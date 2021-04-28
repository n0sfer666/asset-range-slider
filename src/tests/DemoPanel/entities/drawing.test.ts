import Drawing from '../../../DemoPanel/entities/Drawing';

describe('Drawing.ts', () => {
  const testInstance = new Drawing();
  const { getDOMElement } = testInstance;

  test('getDomElement(typeElement, className)', () => {
    const testTypeElement = 'div';
    const testClassName = 'test';
    const $expectElement: JQuery = jQuery(document.createElement(testTypeElement));
    $expectElement.addClass(`demo-panel__${testClassName}`);
    expect($expectElement).toEqual(getDOMElement(testTypeElement, testClassName));
  });

  test('getContainerElement(typeContainer?)', () => {
    const testTypeContainer: tContainer = 'main';
    const $expectContainer = getDOMElement('div', 'container');
    const $expectContainerWithType = testInstance
      .getDOMElement('div', `${testTypeContainer}-container`);
    expect($expectContainer).toEqual(testInstance.getContainerElement());
    expect($expectContainerWithType)
      .toEqual(testInstance.getContainerElement(testTypeContainer));
  });

  test('getTextElement({ isTitle = false, text = "" })', () => {
    const testText = 'test';
    const $expectTextElement = getDOMElement('h3', 'text').text(testText);
    const $expectTitleTextElement = getDOMElement('h2', 'text-title').text(testText);
    expect($expectTextElement).toEqual(testInstance.getTextElement({ text: testText }));
    expect($expectTitleTextElement)
      .toEqual(testInstance.getTextElement({ isTitle: true, text: testText }));
  });

  test('getCheckboxElement(isChecked, text)', () => {
    const testText = 'test';
    [true, false].forEach((isChecked) => {
      const $expectedCheckbox = getDOMElement('label', 'label').text(testText);
      $expectedCheckbox.prepend(
        getDOMElement('input', 'checkbox')
          .prop('type', 'checkbox')
          .prop('checked', isChecked),
      );
      expect($expectedCheckbox).toEqual(testInstance.getCheckboxElement(isChecked, testText));
    });
  });

  test('getRadioElement(title, name, isChecked)', () => {
    const testTitle = 'test';
    const testName = 'test';
    [true, false].forEach((isChecked) => {
      const $expectRadio = getDOMElement('label', 'label');
      $expectRadio.prepend(
        getDOMElement('input', 'radio')
          .prop('name', testName)
          .prop('type', 'radio')
          .prop('checked', isChecked),
      );
      $expectRadio.append(getDOMElement('span', 'label-text').text(testTitle));
      expect($expectRadio).toEqual(testInstance.getRadioElement(testTitle, testName, isChecked));
    });
  });

  test('getConfigInputElement(value, index, name?)', () => {
    const testValue = Math.round(Math.random() * 1e3);
    const testIndex = Math.round(Math.random());
    const testName = 'test';
    const $expectInput = getDOMElement('input', 'config-input')
      .val(testValue)
      .prop('type', 'text')
      .prop('name', `input-${testIndex}`);
    const $expectInputWithName = getDOMElement('input', 'config-input')
      .val(testValue)
      .prop('type', 'text')
      .prop('name', `${testName}-${testIndex}`);
    expect($expectInput).toEqual(testInstance.getConfigInputElement(testValue, testIndex));
    expect($expectInputWithName)
      .toEqual(testInstance.getConfigInputElement(testValue, testIndex, testName));
  });

  test('getButtonControlElement(isIncrease)', () => {
    [true, false].forEach((isIncrease) => {
      const $expectButton = getDOMElement('button', 'count-control-button')
        .text(isIncrease ? '+' : '-');
      expect($expectButton).toEqual(testInstance.getButtonControlElement(isIncrease));
    });
  });
});
