import SimpleRangeSlider from '../../SimpleRangeSlider/SimpleRangeSlider';
import ControlButton from '../control-button/control-button';
import getControlButton from '../control-button/getControlButton';
import getRadioBlocks from '../radio-block/getRadioBlocks';
import RadioBlock from '../radio-block/radio-block';
import TextInput from '../text-input-block/text-input-block';
import getTextInputBlocks from '../text-input-block/text-input-block-init';

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
    this.textInputBlocks = getTextInputBlocks(
      this.$configContainer,
      this.sliderInstance,
      this.isSinglePointer,
    );
    this.radioBlocks = getRadioBlocks(this.$configContainer, this.sliderInstance);
    this.controlButton = getControlButton(
      this.$configContainer,
      this.getSecondStart(),
      this.sliderInstance,
    );
  }

  getSecondStart(): JQuery {
    let secondStart: JQuery = $(document.createElement('div'));
    this.textInputBlocks.forEach((textInput) => {
      if (textInput.configurationName === 'start') {
        // eslint-disable-next-line prefer-destructuring
        secondStart = textInput.inputs[1];
      }
    });
    return secondStart;
  }
}

export default DemoPanel;
