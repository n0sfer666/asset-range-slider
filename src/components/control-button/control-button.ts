import Presenter from '../../SimpleRangeSlider/Presenter/Presenter';

class ControlButton {
  readonly blockClass: string = 'control-button';

  $container: JQuery;

  $secondValue: JQuery;

  $sliderContainer: JQuery;

  $text: JQuery;

  sliderInstance: Presenter;

  sliderConfig: CompleteConfigList;

  isSinglePointer: boolean;

  constructor($container: JQuery, $secondValue: JQuery, $sliderContainer: JQuery) {
    this.bindContext();
    this.$container = $container;
    this.$secondValue = $secondValue;
    this.$sliderContainer = $sliderContainer;
    this.sliderInstance = $sliderContainer.data('SimpleRangeSlider');
    this.sliderConfig = this.sliderInstance.getConfig();
    this.isSinglePointer = this.sliderConfig.values.length === 1;
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
      values, range, step,
    } = this.sliderConfig;
    const newValue = step < 10
      ? values[0] + 10
      : values[0] + step;
    if (newValue < range[1]) {
      this.isSinglePointer = false;
      values.push(newValue);
      this.$secondValue.show().val(values[1] || values[1] === 0 ? values[1] : NaN);
      this.sliderInstance.updateSlider({ values });
      this.$text.text('remove pointer');
    } else {
      this.$container.addClass(`${this.blockClass}_wrong-condition`);
      setTimeout(() => {
        this.$container.removeClass(`${this.blockClass}_wrong-condition`);
      }, 300);
    }
  }

  removePointer() {
    const { values } = this.sliderConfig;
    this.isSinglePointer = true;
    values.pop();
    this.$secondValue.hide().val('');
    this.sliderInstance.updateSlider({ values });
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
