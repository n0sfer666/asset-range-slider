import '../../SimpleRangeSlider/SimpleRangeSliderJQ';

class RadioBlock {
  readonly blockClass: string = 'radio-block';

  $mainContainer: JQuery;

  $sliderContainer: JQuery;

  sliderConfig: CompleteConfigList;

  configurationName: string;

  configurationValue: boolean | string;

  radioBlocks: JQuery[] = [];

  constructor($container: JQuery, $sliderContainer: JQuery) {
    this.bindContext();
    this.$mainContainer = $container;
    this.$sliderContainer = $sliderContainer.getSliderConfig();
    this.sliderConfig = $sliderContainer.data('config');
    this.configurationName = this.$mainContainer.data('configuration-name');
    this.configurationValue = this.sliderConfig[this.configurationName];
    this.radioBlocks = this.getRadioBlocks();
    this.bindHandlers();
  }

  getRadioBlocks(): JQuery[] {
    return Array.from(
      this.$mainContainer.find(`.js-${this.blockClass}__radio`).map(
        (_, element) => $(element).prop(
          'checked',
          this.getText($(element)) === this.configurationValue,
        ),
      ),
    );
  }

  handleRadioClick(event: JQuery.MouseEventBase) {
    const $target = $(event.target);
    const value = this.getText($target);
    if (value !== this.configurationValue) {
      this.configurationValue = value;
      this.$sliderContainer.updateSlider({ [this.configurationName]: this.configurationValue });
      // this.sliderInstance.rebuildSlider({ [this.configurationName]: this.configurationValue });
    }
  }

  getText($radio: JQuery): string | boolean {
    return this.configurationName === 'orientation'
      ? $radio.data('text')
      : $radio.data('text') === 'enable';
  }

  bindContext() {
    this.handleRadioClick = this.handleRadioClick.bind(this);
  }

  bindHandlers() {
    this.radioBlocks.forEach(($element) => {
      $element.on('click', this.handleRadioClick);
    });
  }
}

export default RadioBlock;
