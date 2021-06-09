import SimpleRangeSlider from '../../SimpleRangeSlider/SimpleRangeSlider';

class ControlButton {
  $container: JQuery

  $sliderContainer: JQuery

  $text: JQuery

  $secondStart: JQuery

  blockClass: string

  sliderInstance: SimpleRangeSlider

  sliderConfig: iCompleteConfig

  isSinglePointer: boolean

  constructor(
    $container: JQuery,
    $secondStart: JQuery,
    blockClass: string,
    sliderInstance: SimpleRangeSlider,
  ) {
    this.blockClass = blockClass;
    this.$container = $container;
    this.$secondStart = $secondStart;
    this.$text = $container.find(`.js-${blockClass}__text`);
    this.sliderInstance = sliderInstance;
    this.$sliderContainer = sliderInstance.$container;
    this.sliderConfig = sliderInstance.completeConfig;
    this.isSinglePointer = this.sliderConfig.start.length === 1;
    this.bindContext();
    this.bindHandlers();
  }

  handleButtonClick() {
    const { start, range, step } = this.sliderConfig;
    if (this.isSinglePointer) {
      const newValue = step < 5
        ? start[0] + 5
        : start[0] + step;
      if (newValue < range[1]) {
        this.isSinglePointer = false;
        start.push(newValue);
        if (this.sliderConfig.input && this.sliderConfig.input.$values) {
          this.sliderConfig.input.$values[1].show();
        }
        if (start[1]) {
          this.$secondStart.show().val(start[1]);
        }
        this.rebuildSlider();
        this.$text.text('remove pointer');
      }
    } else {
      this.isSinglePointer = true;
      start.pop();
      if (this.sliderConfig.input && this.sliderConfig.input.$values) {
        this.sliderConfig.input.$values[1].hide();
      }
      this.$secondStart.hide().val('');
      this.rebuildSlider();
      this.$text.text('add pointer');
    }
  }

  bindContext() {
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  bindHandlers() {
    this.$container.on('click', this.handleButtonClick);
  }

  rebuildSlider() {
    this.$sliderContainer.empty();
    this.sliderInstance = new SimpleRangeSlider(this.$sliderContainer, this.sliderConfig);
  }
}

export default ControlButton;
