import SimpleRangeSlider from '../../SimpleRangeSlider/SimpleRangeSlider';

class TextInput {
  readonly blockClass: string

  $mainContainer: JQuery

  sliderInstance: SimpleRangeSlider

  $sliderContainer: JQuery

  sliderConfig: iCompleteConfig

  isSinglePointer: boolean

  inputs: JQuery[] = []

  configurationName: string

  configurationValue: number | number[]

  constructor(
    $container: JQuery,
    blockClass: string,
    sliderInstance: SimpleRangeSlider,
    isSinglePointer: boolean,
  ) {
    this.$mainContainer = $container;
    this.blockClass = blockClass;
    this.sliderInstance = sliderInstance;
    this.$sliderContainer = sliderInstance.$container;
    this.sliderConfig = this.sliderInstance.completeConfig;
    this.isSinglePointer = isSinglePointer;
    this.$mainContainer.find(`.js-${this.blockClass}__input`).each((_, element) => {
      this.inputs.push($(element));
    });
    this.configurationName = $container.data('configuration-name');
    if (this.configurationName === 'start' && isSinglePointer) {
      this.inputs[1].hide();
    }
    this.configurationValue = sliderInstance.config[this.configurationName];
    this.inputs.forEach((input, index) => {
      $(input).val(
        Array.isArray(this.configurationValue)
          ? this.configurationValue[index]
          : this.configurationValue,
      );
    });
    this.bindContext();
    this.bindHandlers();
  }

  handleInputFocusOut(event: JQuery.FocusOutEvent) {
    const $target = $(event.target);
    const { range, start } = this.sliderConfig;
    const value = Number($target.val());
    const index = Number($target.data('index'));
    switch (this.configurationName) {
      case 'step': {
        const isTooBigStep = value > Math.round((Math.abs(range[0]) + Math.abs(range[1])) / 10);
        const isZero = value === 0;
        if (!isTooBigStep && !isZero) {
          this.sliderConfig.step = value;
          this.rebuildSlider();
        } else {
          this.blinkInputAndReturnPreviousValue($target, this.sliderConfig.step);
        }
        break;
      }
      case 'start': {
        if (this.isSinglePointer) {
          const isOutOfRange = value < range[0] || value > range[1];
          if (!isOutOfRange) {
            this.sliderConfig.start[index] = value;
            this.rebuildSlider();
          } else {
            this.blinkInputAndReturnPreviousValue($target, this.sliderConfig.start[index]);
            $target.val();
          }
        } else {
          const isOutOfRange = start[1]
            ? value < range[0] || value > start[1]
            : value < start[0] || value > range[1];
          const isEqualOtherStart = start[1]
            ? value === start[1]
            : value === start[0];
          if (!isOutOfRange && !isEqualOtherStart) {
            this.sliderConfig.start[index] = value;
            this.rebuildSlider();
          } else {
            this.blinkInputAndReturnPreviousValue($target, this.sliderConfig.start[index]);
          }
        }
        break;
      }
      case 'range': {
        const isEqualOtherRange = index === 0
          ? value === range[1]
          : value === range[0];
        if (this.isSinglePointer) {
          const isOutOfStart = index === 0
            ? value > start[0]
            : value < start[0];
          if (!isOutOfStart && !isEqualOtherRange) {
            this.sliderConfig.range[index] = value;
            this.rebuildSlider();
          } else {
            this.blinkInputAndReturnPreviousValue($target, range[index]);
          }
        } else {
          const isOutOfStart = index === 0
            ? value > start[index]
            : value < start[index];
          if (!isOutOfStart && !isEqualOtherRange) {
            this.sliderConfig.range[index] = value;
            this.rebuildSlider();
          } else {
            this.blinkInputAndReturnPreviousValue($target, range[index]);
          }
        }
        break;
      }
      default:
        break;
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

  rebuildSlider() {
    this.$sliderContainer.empty();
    this.sliderInstance = new SimpleRangeSlider(this.$sliderContainer, this.sliderConfig);
  }

  // eslint-disable-next-line class-methods-use-this
  blinkInputAndReturnPreviousValue($input: JQuery, previousValue: number) {
    $input.css('border', '2px solid red');
    setTimeout(() => {
      $input.css('border', '');
    }, 250);
    $input.val(previousValue);
  }
}

export default TextInput;
