class ControlButton {
  readonly blockClass: string = 'control-button';

  $container: JQuery;

  $secondStart: JQuery;

  $sliderContainer: JQuery;

  $text: JQuery;

  sliderConfig: CompleteConfigList;

  isSinglePointer: boolean;

  constructor($container: JQuery, $secondStart: JQuery, $sliderContainer: JQuery) {
    this.bindContext();
    this.$container = $container;
    this.$secondStart = $secondStart;
    this.$sliderContainer = $sliderContainer.getSliderConfig();
    this.sliderConfig = $sliderContainer.data('config');
    this.isSinglePointer = this.sliderConfig.start.length === 1;
    this.initText();
    this.bindHandlers();
  }

  initText() {
    this.$text = this.$container.find(`.js-${this.blockClass}__text`)
      .text(this.isSinglePointer ? 'add pointer' : 'remove pointer');
  }

  handleButtonClick() {
    const {
      start, range, step, input,
    } = this.sliderConfig;
    if (this.isSinglePointer) {
      const newValue = step < 10
        ? start[0] + 5
        : start[0] + step;
      if (newValue < range[1]) {
        this.isSinglePointer = false;
        start.push(newValue);
        if (input && input.values) {
          input.values[1].show();
        }
        if (start[1]) {
          this.$secondStart.show().val(start[1]);
        }
        this.$sliderContainer.updateSlider({ start });
        this.$text.text('remove pointer');
      }
    } else {
      this.isSinglePointer = true;
      start.pop();
      if (input && input.values) {
        input.values[1].hide();
      }
      this.$secondStart.hide().val('');
      this.$sliderContainer.updateSlider({ start });
      this.$text.text('add pointer');
    }
  }

  rebuildSlider(config: CompleteConfigList) {
    this.$sliderContainer.empty();
    this.$sliderContainer.removeData();
    this.$sliderContainer.simpleRangeSlider(<UserConfigList> config);
  }

  bindContext() {
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  bindHandlers() {
    this.$container.on('click', this.handleButtonClick);
  }
}

export default ControlButton;
