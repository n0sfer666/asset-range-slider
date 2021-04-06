class Drawing {
  private getDOMElement(typeElement: string, className: string): JQuery {
    const element: JQuery = jQuery(document.createElement(typeElement));
    element.addClass(`demo-panel__${className}`);
    return element;
  }

  getContainerElement(typeContainer: tContainer): JQuery {
    return this.getDOMElement('div', `${typeContainer}-container`);
  }

  getTextElement({ isTitle = false, text = '' }): JQuery {
    if (isTitle) {
      return this.getDOMElement('h2', 'text-title').text(text);
    }
    return this.getDOMElement('h3', 'text').text(text);
  }

  getCheckboxElement(isChecked: boolean, text: string): JQuery {
    const $result = this.getDOMElement('label', 'checkbox-label').text(text);
    const $checkbox = this.getDOMElement('input', 'checkbox');
    $checkbox.prop('type', 'checkbox');
    $checkbox.prop('checked', isChecked);
    $result.append($checkbox);
    return $result;
  }

  getRadioElement(title: string, name: string, isChecked: boolean): JQuery {
    const $result = this.getDOMElement('label', 'radio-label').text(title);
    const $radio = this.getDOMElement('input', 'radio');
    $radio.prop('name', name);
    $radio.prop('type', 'radio');
    $radio.prop('checked', isChecked);
    $result.append($radio);
    return $result;
  }

  getConfigInputElement(value: number): JQuery {
    const $input: JQuery = this.getDOMElement('input', 'config-input').val(value);
    $input.prop('type', 'text');

    return $input;
  }

  getButtonElement(isIncrease: boolean): JQuery {
    const $button: JQuery = this.getDOMElement('button', 'count-control-button');
    $button.text(isIncrease ? '+' : '-');
    return $button;
  }
}

export default Drawing;
