import '../../SimpleRangeSlider/SimpleRangeSliderJQ';

class RadioBlock {
  readonly blockClass: string = 'radio-block';

  $mainContainer: JQuery;

  $sliderContainer: JQuery;

  sliderConfig: CompleteConfigList;

  configurationName: string;

  configurationValue: boolean | string;

  radioBlocks: JQuery[] = [];

  constructor($container: JQuery, $sliderContainer: JQuery, sliderConfig: CompleteConfigList) {
    this.bindContext();
    this.$mainContainer = $container;
    this.$sliderContainer = $sliderContainer;
    this.sliderConfig = sliderConfig;
    this.configurationName = this.$mainContainer.data('configuration-name');
    this.configurationValue = this.sliderConfig[this.configurationName];
    this.radioBlocks = this.getRadioBlocks();
    this.bindHandlers();
  }

  getRadioBlocks(): JQuery[] {
    const radioBlocks: JQuery[] = [];
    this.$mainContainer.find(`.js-${this.blockClass}__label`).each((_, element) => {
      const $radio = $(element).find(`.js-${this.blockClass}__radio`);
      const value = this.getText($radio);
      $radio.prop('checked', value === this.configurationValue);
      radioBlocks.push($radio);
    });
    return radioBlocks;
  }

  handleRadioClick(event: JQuery.MouseEventBase) {
    const $target = $(event.target);
    const value = this.getText($target);
    if (value !== this.configurationValue) {
      this.configurationValue = value;
      this.sliderConfig[this.configurationName] = this.configurationValue;
      this.rebuildSlider(this.sliderConfig);
    }
  }

  getText($radio: JQuery): string | boolean {
    return this.configurationName === 'orientation'
      ? $radio.data('text')
      : $radio.data('text') === 'enable';
  }

  rebuildSlider(config: CompleteConfigList) {
    this.$sliderContainer.empty();
    this.$sliderContainer.removeData();
    this.$sliderContainer.simpleRangeSlider(<ConfigUserList> config);
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
