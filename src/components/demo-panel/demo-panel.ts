import SimpleRangeSlider from '../../SimpleRangeSlider/SimpleRangeSlider';

class DemoPanel {
  $mainContainer: JQuery

  $sliderContainer: JQuery

  sliderInstance: SimpleRangeSlider

  sliderConfig: iConfigUser

  $configContainer: JQuery

  $control: tConfigInput

  $controlButton: JQuery

  constructor($container: JQuery) {
    this.$mainContainer = $container;
    this.$sliderContainer = this.$mainContainer.find('.js-slider');
    this.$configContainer = this.$mainContainer.find('.js-demo-panel__config');
    this.$control = {
      $values: [this.$configContainer.find('.js-text-input-block__input[name="control-0"]')],
      $tooltip: this.$configContainer.find('.js-text-input-block__checkbox[name="tooltip"'),
    };
    this.sliderConfig = { input: this.$control };
    this.sliderInstance = new SimpleRangeSlider(this.$sliderContainer, this.sliderConfig);
  }
}

export default DemoPanel;
