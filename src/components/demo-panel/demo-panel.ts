import SimpleRangeSlider from '../../SimpleRangeSlider/SimpleRangeSlider';
import TextInput from '../text-input-block/text-input-block';

class DemoPanel {
  readonly blockClass = 'text-input-block'

  $mainContainer: JQuery

  $sliderContainer: JQuery

  sliderInstance: SimpleRangeSlider

  sliderConfig: iConfigUser

  $configContainer: JQuery

  isSinglePointer: boolean

  textInputBlocks: TextInput[] = []

  constructor($container: JQuery) {
    this.$mainContainer = $container;
    this.$sliderContainer = this.$mainContainer.find('.js-slider');
    this.$configContainer = this.$mainContainer.find('.js-demo-panel__config');
    this.sliderConfig = {
      input: {
        $values: [this.$configContainer.find(`.js-${this.blockClass}__input[name="control"]`)],
        $tooltip: this.$configContainer.find(`.js-${this.blockClass}__checkbox[name="tooltip"`),
      },
    };
    this.sliderInstance = new SimpleRangeSlider(this.$sliderContainer, this.sliderConfig);
    this.sliderConfig = this.sliderInstance.config;
    this.isSinglePointer = this.sliderConfig.start?.length === 1;
    $('.js-text-input-block').each((_, element) => {
      if (!$(element).hasClass(`${this.blockClass}_isControl`)) {
        this.textInputBlocks.push(
          new TextInput(
            $(element),
            this.blockClass,
            this.sliderInstance,
            this.isSinglePointer,
          ),
        );
      }
    });
  }
}

export default DemoPanel;
