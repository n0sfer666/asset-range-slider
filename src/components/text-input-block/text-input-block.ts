import '../../SimpleRangeSlider/SimpleRangeSliderJQ';

class TextInput {
  readonly blockClass: string = 'text-input-block';

  $mainContainer: JQuery;

  $sliderContainer: JQuery;

  sliderConfig: CompleteConfigList;

  inputs: JQuery[] = [];

  configurationName: string;

  configurationValue: number | ConfigRange | PointerValue;

  constructor($container: JQuery, $sliderContainer: JQuery) {
    this.bindContext();
    this.$mainContainer = $container;
    this.$sliderContainer = $sliderContainer.getSliderConfig();
    this.sliderConfig = $sliderContainer.data('config');
    this.configurationName = $container.data('configuration-name');
    this.configurationValue = this.sliderConfig[this.configurationName];
    this.initInputs();
    this.bindHandlers();
  }

  initInputs() {
    this.inputs = Array.from(this.$mainContainer.find(`.js-${this.blockClass}__input`)
      .map((_, element) => $(element)));
    const isSinglePointer = this.sliderConfig.start.length === 1;
    if (this.configurationName === 'start' && isSinglePointer) {
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
    const $target = $(event.target);
    const value = Number($target.val());
    const index = Number($target.data('index'));
    const isNotEqualPrevious = Array.isArray(this.configurationValue)
      ? value !== this.configurationValue[index]
      : value !== this.configurationValue;
    if (isNotEqualPrevious) {
      if (Array.isArray(this.configurationValue)) {
        this.configurationValue[index] = value;
      } else {
        this.configurationValue = value;
      }
      switch (this.configurationName) {
        case 'step': {
          if (!Array.isArray(this.configurationValue)) {
            this.$sliderContainer.updateSlider({ step: this.configurationValue });
          }
          break;
        }
        case 'start': {
          if (Array.isArray(this.configurationValue)) {
            this.$sliderContainer.updateSlider({ start: <PointerValue> this.configurationValue });
          }
          break;
        }
        case 'range': {
          if (Array.isArray(this.configurationValue)) {
            this.$sliderContainer.updateSlider({ range: <ConfigRange> this.configurationValue });
          }
          break;
        }
        default:
          break;
      }
    }
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
