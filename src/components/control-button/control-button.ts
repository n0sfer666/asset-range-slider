import Presenter from '../../SimpleRangeSlider/Presenter/Presenter';

class ControlButton {
  readonly blockClass: string = 'control-button';

  $container: JQuery;

  $secondStart: JQuery;

  $sliderContainer: JQuery;

  $text: JQuery;

  sliderInstance: Presenter;

  sliderConfig: CompleteConfigList;

  isSinglePointer: boolean;

  constructor($container: JQuery, $secondStart: JQuery, $sliderContainer: JQuery) {
    this.bindContext();
    this.$container = $container;
    this.$secondStart = $secondStart;
    this.$sliderContainer = $sliderContainer;
    this.sliderInstance = $sliderContainer.data('SimpleRangeSlider');
    this.sliderConfig = this.sliderInstance.getConfig();
    this.isSinglePointer = this.sliderConfig.start.length === 1;
    this.initText();
    this.bindHandlers();
  }

  initText() {
    this.$text = this.$container.find(`.js-${this.blockClass}__text`)
      .text(this.isSinglePointer ? 'add pointer' : 'remove pointer');
  }

  handleButtonClick() {
    this.sliderConfig = this.sliderInstance.getConfig();
    if (this.isSinglePointer) {
      this.addPointerIfPossible();
    } else {
      this.removePointer();
    }
  }

  addPointerIfPossible() {
    const {
      start, range, step, input,
    } = this.sliderConfig;
    const newValue = step < 10
      ? start[0] + 10
      : start[0] + step;
    if (newValue < range[1]) {
      this.isSinglePointer = false;
      start.push(newValue);
      input!.values![1]!.show();
      this.$secondStart.show().val(start[1]!);
      this.sliderInstance.updateSlider({ start });
      this.$text.text('remove pointer');
    } else {
      this.$container.addClass(`${this.blockClass}_wrong-condition`);
      setTimeout(() => {
        this.$container.removeClass(`${this.blockClass}_wrong-condition`);
      }, 300);
    }
  }

  removePointer() {
    const { start, input } = this.sliderConfig;
    this.isSinglePointer = true;
    start.pop();
    input!.values![1]!.hide();
    this.$secondStart.hide().val('');
    this.sliderInstance.updateSlider({ start });
    this.$text.text('add pointer');
  }

  bindContext() {
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  bindHandlers() {
    this.$container.on('click', this.handleButtonClick);
  }
}

export default ControlButton;
