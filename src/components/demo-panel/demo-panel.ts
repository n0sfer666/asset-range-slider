import SimpleRangeSlider from '../../SimpleRangeSlider/SimpleRangeSlider';
import ControlButton from '../control-button/control-button';
import RadioBlock from '../radio-block/radio-block';
import TextInput from '../text-input-block/text-input-block';

class DemoPanel {
  readonly blockClass = 'demo-panel'

  $mainContainer: JQuery

  $sliderContainer: JQuery

  sliderInstance: SimpleRangeSlider

  sliderConfig: iConfigUser

  $configContainer: JQuery

  isSinglePointer: boolean

  textInputBlocks: TextInput[] = []

  radioBlocks: RadioBlock[] = []

  controlButton: ControlButton

  constructor($container: JQuery) {
    this.$mainContainer = $container;
    this.$sliderContainer = this.$mainContainer.find(`.js-${this.blockClass}__slider-container`);
    this.$configContainer = this.$mainContainer.find(`.js-${this.blockClass}__config`);
    const $control = this.$configContainer.find('.js-text-input-block__input[name="control"]');
    const $values: JQuery[] = [];
    $.each($control, (_, element) => {
      $values.push($(element));
    });
    this.sliderConfig = {
      input: {
        $values,
        $tooltip: this.$configContainer.find('.js-text-input-block__checkbox[name="tooltip"'),
      },
    };
    this.sliderInstance = new SimpleRangeSlider(this.$sliderContainer, this.sliderConfig);
    this.sliderConfig = this.sliderInstance.completeConfig;
    this.isSinglePointer = this.sliderConfig.start?.length === 1;
    $('.js-text-input-block').each((_, element) => {
      if (!$(element).hasClass('text-input-block_isControl')) {
        this.textInputBlocks.push(
          new TextInput(
            $(element),
            this.sliderInstance,
            this.isSinglePointer,
          ),
        );
      }
    });
    $('.js-radio-block').each((_, element) => {
      this.radioBlocks.push(
        new RadioBlock(
          $(element),
          this.sliderInstance,
        ),
      );
    });
    this.controlButton = new ControlButton(
      $('.js-control-button'),
      $('.js-text-input-block__input[name="start"][data-index="1"]'),
      this.sliderInstance,
    );
  }
}

export default DemoPanel;
