import Presenter from '../../SimpleRangeSlider/Presenter/Presenter';
import '../../SimpleRangeSlider/SimpleRangeSliderJQ';

class TextInput {
  readonly blockClass: string = 'text-input-block';

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
    this.inputs = Array.from(this.$mainContainer.find(`.js-${this.blockClass}__input`)
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

  handleInputFocusOut(event: JQuery.FocusOutEvent) {
    this.sliderConfig = this.sliderInstance.getConfig();
    const $target = $(event.target);
    const value = Number($target.val());
    const index = Number($target.data('index'));
    const isNotEqualPrevious = Array.isArray(this.configurationValue)
      ? value !== this.configurationValue[index]
      : value !== this.configurationValue;
    const { range, values } = this.sliderConfig;
    const isSinglePointer = values.length === 1;
    if (isNotEqualPrevious) {
      if (!Array.isArray(this.configurationValue)) {
        if (value > 0) {
          const isStep = this.configurationName === 'step';
          if (isStep) {
            this.configurationValue = value;
            this.sliderConfig[this.configurationName] = this.configurationValue;
          }
        } else {
          this.blinkInputAndReturnPreviousValue($target, this.configurationValue);
        }
      } else {
        switch (this.configurationName) {
          case 'values': {
            if (isSinglePointer) {
              const isNotOutOfRange = value >= range[0] && value <= range[1];
              if (isNotOutOfRange) {
                this.configurationValue[index] = value;
              } else {
                this.blinkInputAndReturnPreviousValue($target, this.configurationValue[index]);
              }
            } else if (values[1] || values[1] === 0) {
              const isNotOutOfRange = index === 0
                ? value >= range[0] && value <= values[1]
                : value >= values[0] && value <= range[1];
              const isNotEqualOtherStart = index === 0
                ? value !== values[1]
                : value !== values[0];
              if (isNotOutOfRange && isNotEqualOtherStart) {
                this.configurationValue[index] = value;
              } else {
                this.blinkInputAndReturnPreviousValue($target, this.configurationValue[index]);
              }
            }
            break;
          }
          case 'range': {
            const isNotEqualOtherRange = index === 0
              ? value !== range[1]
              : value !== range[0];
            if (isSinglePointer) {
              const isOutOfStart = index === 0
                ? value <= values[0]
                : value >= values[0];
              if (isNotEqualOtherRange && isOutOfStart) {
                this.configurationValue[index] = value;
              } else {
                this.blinkInputAndReturnPreviousValue($target, this.configurationValue[index]);
              }
            } else if (values[1] || values[1] === 0) {
              const isOutOfStart = index === 0
                ? value <= values[0]
                : value >= values[1];
              if (isNotEqualOtherRange && isOutOfStart) {
                this.configurationValue[index] = value;
              } else {
                this.blinkInputAndReturnPreviousValue($target, this.configurationValue[index]);
              }
            }
            break;
          }
          default:
            break;
        }
      }
      this.updateSlider();
    }
  }

  updateSlider() {
    this.sliderInstance.updateSlider({ [this.configurationName]: this.configurationValue });
  }

  bindHandlers() {
    this.inputs.forEach((input) => {
      $(input).on('focusout', this.handleInputFocusOut);
    });
  }

  bindContext() {
    this.handleInputFocusOut = this.handleInputFocusOut.bind(this);
  }

  blinkInputAndReturnPreviousValue($input: JQuery, previousValue: number) {
    $input.addClass(`${this.blockClass}__input_wrong`);
    setTimeout(() => {
      $input.removeClass(`${this.blockClass}__input_wrong`);
    }, 250);
    $input.val(previousValue);
  }
}

export default TextInput;
