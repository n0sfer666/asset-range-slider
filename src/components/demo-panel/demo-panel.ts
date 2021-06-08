import SimpleRangeSlider from '../../SimpleRangeSlider/SimpleRangeSlider';
import RadioBlock from '../radio-block/radio-block';
import TextInput from '../text-input-block/text-input-block';

class DemoPanel {
  readonly mainBlockClass = 'demo-panel'

  readonly textInputBlockClass = 'text-input-block'

  readonly radioBlockClass = 'radio-block'

  $mainContainer: JQuery

  $sliderContainer: JQuery

  sliderInstance: SimpleRangeSlider

  sliderConfig: iConfigUser

  $configContainer: JQuery

  isSinglePointer: boolean

  textInputBlocks: TextInput[] = []

  radioBlocks: RadioBlock[] = []

  constructor($container: JQuery) {
    this.$mainContainer = $container;
    this.$sliderContainer = this.$mainContainer.find(`.js-${this.mainBlockClass}__slider`);
    this.$configContainer = this.$mainContainer.find(`.js-${this.mainBlockClass}__slider`);
    this.sliderConfig = {
      input: {
        $values: [this.$configContainer.find(`.js-${this.textInputBlockClass}__input[name="control"]`)],
        $tooltip: this.$configContainer.find(`.js-${this.textInputBlockClass}__checkbox[name="tooltip"`),
      },
    };
    this.sliderInstance = new SimpleRangeSlider(this.$sliderContainer, this.sliderConfig);
    this.sliderConfig = this.sliderInstance.config;
    this.isSinglePointer = this.sliderConfig.start?.length === 1;
    $(`.js-${this.textInputBlockClass}`).each((_, element) => {
      if (!$(element).hasClass(`${this.textInputBlockClass}_isControl`)) {
        this.textInputBlocks.push(
          new TextInput(
            $(element),
            this.textInputBlockClass,
            this.sliderInstance,
            this.isSinglePointer,
          ),
        );
      }
    });
    $(`.js-${this.radioBlockClass}`).each((_, element) => {
      this.radioBlocks.push(
        new RadioBlock(
          $(element),
          this.radioBlockClass,
          this.sliderInstance,
        ),
      );
    });
  }
}

export default DemoPanel;
