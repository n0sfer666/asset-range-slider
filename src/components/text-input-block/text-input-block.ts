import Presenter from '../../SimpleRangeSlider/Presenter/Presenter';
import { TextInputBlockEvent } from './types';

const classes = {
  input: 'text-input-block__input',
};

class TextInput {
  $mainContainer: JQuery;

  $sliderContainer: JQuery;

  sliderInstance: Presenter;

  sliderConfig: CompleteConfigList;

  inputs: JQuery[] = [];

  configurationName: string;

  configurationValue: number | ConfigRange | PointerValue;

  constructor($container: JQuery, $sliderContainer: JQuery) {
    this.bindContext();
    this.$mainContainer = $container;
    this.$sliderContainer = $sliderContainer;
    this.sliderInstance = $sliderContainer.data('SimpleRangeSlider');
    this.sliderConfig = this.sliderInstance.getConfig();
    this.configurationName = $container.data('configuration-name');
    this.configurationValue = this.sliderConfig[this.configurationName];
    this.initInputs();
    this.bindHandlers();
  }

  initInputs() {
    this.inputs = Array.from(this.$mainContainer.find(`.js-${classes.input}`)
      .map((_, element) => $(element)));
    const isSinglePointer = this.sliderConfig.values.length === 1;
    if (this.configurationName === 'values' && isSinglePointer) {
      this.inputs[1].hide();
    }
    this.inputs.forEach((input, index) => {
      $(input).val(
        Array.isArray(this.configurationValue)
          ? this.configurationValue[index]
          : this.configurationValue,
      );
    });
  }

  handleInputFocusOut(event: TextInputBlockEvent) {
    this.sliderConfig = this.sliderInstance.getConfig();
    const $target = $(event.target);
    const value = Number($target.val());
    const index = Number($target.data('index'));
    const lastValue = Array.isArray(this.configurationValue)
      ? [...this.configurationValue]
      : this.configurationValue;
    if (Array.isArray(this.configurationValue)) {
      this.configurationValue[index] = value;
    } else {
      this.configurationValue = value;
    }
    this.updateSlider(
      Array.isArray(this.configurationValue)
        ? [...this.configurationValue]
        : this.configurationValue,
    );
    const newValue = this.sliderConfig[this.configurationName];
    const isCorrectValue = JSON.stringify(newValue) === JSON.stringify(this.configurationValue);
    if (!isCorrectValue) {
      this.blinkInputAndReturnPreviousValue(
        $target,
        Array.isArray(lastValue) ? lastValue[index] : lastValue,
        index,
      );
    }
  }

  handleDocumentMousedown() {
    $(document).on('mousemove', this.handleDocumentMousemove)
      .on('mouseup', TextInput.handleDocumentMouseup);
  }

  handleDocumentMousemove() {
    this.inputs.forEach((input, index) => {
      if (Array.isArray(this.configurationValue)) {
        input.val(this.configurationValue[index]);
      } else {
        input.val(this.configurationValue);
      }
    });
  }

  static handleDocumentMouseup() {
    $(document).off('mousemove').off('mouseup');
  }

  updateSlider(value: number | ConfigRange | PointerValue) {
    this.sliderInstance.updateSlider({ [this.configurationName]: value });
    this.sliderConfig = this.sliderInstance.getConfig();
  }

  bindHandlers() {
    this.inputs.forEach((input) => {
      $(input).on('focusout', this.handleInputFocusOut)
        .on('mouseout', this.handleInputFocusOut);
    });
    $(document).on('mousedown', this.handleDocumentMousedown);
  }

  bindContext() {
    this.handleInputFocusOut = this.handleInputFocusOut.bind(this);
    this.handleDocumentMousemove = this.handleDocumentMousemove.bind(this);
    this.handleDocumentMousedown = this.handleDocumentMousedown.bind(this);
  }

  blinkInputAndReturnPreviousValue($input: JQuery, previousValue: number, index: number) {
    $input.addClass(`${classes.input}_wrong`);
    setTimeout(() => {
      $input.removeClass(`${classes.input}_wrong`);
    }, 250);
    $input.val(previousValue);
    if (Array.isArray(this.configurationValue)) {
      this.configurationValue[index] = previousValue;
    } else {
      this.configurationValue = previousValue;
    }
    this.updateSlider(this.configurationValue);
  }
}

export default TextInput;
