class ControlButton {
  readonly blockClass: string = 'control-button';

  $container: JQuery;

  $secondStart: JQuery;

  $sliderContainer: JQuery;

  $text: JQuery;

  sliderConfig: CompleteConfigList;

  isSinglePointer: boolean;

  constructor(
    $container: JQuery,
    $secondStart: JQuery,
    $sliderContainer: JQuery,
    sliderConfig: CompleteConfigList,
    isSinglePointer: boolean,
  ) {
    this.bindContext();
    this.$container = $container;
    this.$secondStart = $secondStart;
    this.$sliderContainer = $sliderContainer;
    this.sliderConfig = sliderConfig;
    this.isSinglePointer = isSinglePointer;
    this.$text = this.get$text(this.$container);
    this.$text.text(this.isSinglePointer ? 'add pointer' : 'remove pointer');
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
        this.rebuildSlider(this.sliderConfig);
        this.$text.text('remove pointer');
      }
    } else {
      this.isSinglePointer = true;
      start.pop();
      if (this.sliderConfig.input && this.sliderConfig.input.$values) {
        this.sliderConfig.input.$values[1].hide();
      }
      this.$secondStart.hide().val('');
      this.rebuildSlider(this.sliderConfig);
      this.$text.text('add pointer');
    }
  }

  rebuildSlider(config: CompleteConfigList) {
    this.$sliderContainer.empty();
    this.$sliderContainer.removeData();
    this.$sliderContainer.simpleRangeSlider(<ConfigUserList> config);
  }

  bindContext() {
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  bindHandlers() {
    this.$container.on('click', this.handleButtonClick);
  }
}

export default ControlButton;
