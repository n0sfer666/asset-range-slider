import SimpleRangeSlider from '../../SimpleRangeSlider/SimpleRangeSlider';

class ControlButton {
  readonly blockClass: string = 'control-button';

  $container: JQuery;

  $text: JQuery;

  $secondStart: JQuery;

  sliderInstance: SimpleRangeSlider;

  sliderConfig: CompleteConfigList;

  isSinglePointer: boolean;

  constructor(
    $container: JQuery,
    $secondStart: JQuery,
    sliderInstance: SimpleRangeSlider,
  ) {
    this.$container = $container;
    this.$secondStart = $secondStart;
    this.$text = this.get$text(this.$container);
    this.sliderInstance = sliderInstance;
    this.sliderConfig = sliderInstance.completeConfig;
    this.isSinglePointer = this.sliderConfig.start.length === 1;
    this.$text.text(this.isSinglePointer ? 'add pointer' : 'remove pointer');
    this.bindContext();
    this.bindHandlers();
  }

  get$text($container: JQuery) {
    return $container.find(`.js-${this.blockClass}__text`);
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
        this.sliderInstance.rebuildSlider(this.sliderConfig);
        this.$text.text('remove pointer');
      }
    } else {
      this.isSinglePointer = true;
      start.pop();
      if (this.sliderConfig.input && this.sliderConfig.input.$values) {
        this.sliderConfig.input.$values[1].hide();
      }
      this.$secondStart.hide().val('');
      this.sliderInstance.rebuildSlider(this.sliderConfig);
      this.$text.text('add pointer');
    }
  }

  bindContext() {
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  bindHandlers() {
    this.$container.on('click', this.handleButtonClick);
  }
}

export default ControlButton;
