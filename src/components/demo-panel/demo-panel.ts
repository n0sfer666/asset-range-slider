import SimpleRangeSlider from '../../SimpleRangeSlider/SimpleRangeSlider';
import ControlButton from '../control-button/control-button';
import getControlButton from '../control-button/getControlButton';
import getRadioBlocks from '../radio-block/getRadioBlocks';
import RadioBlock from '../radio-block/radio-block';
import TextInput from '../text-input-block/text-input-block';
import getTextInputBlocks from '../text-input-block/getTextInputBlocks';
import getControlInput from '../text-input-block/getControlInput';

class DemoPanel {
  readonly blockClass = 'demo-panel';

  $mainContainer: JQuery;

  $sliderContainer: JQuery;

  sliderInstance: SimpleRangeSlider;

  sliderConfig: ConfigUserList;

  $configContainer: JQuery;

  isSinglePointer: boolean;

  textInputBlocks: TextInput[] = [];

  radioBlocks: RadioBlock[] = [];

  controlButton: ControlButton;

  constructor($container: JQuery) {
    this.$mainContainer = $container;
    this.$sliderContainer = this.getContainer('slider-container');
    this.$configContainer = this.getContainer('config');
    this.sliderConfig = this.getSliderConfig(this.$mainContainer);
    this.sliderInstance = new SimpleRangeSlider(this.$sliderContainer, this.sliderConfig);
    this.sliderConfig = this.sliderInstance.completeConfig;
    this.isSinglePointer = this.sliderInstance.completeConfig.start.length === 1;
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

  getContainer(type: 'slider-container' | 'config'): JQuery {
    return this.$mainContainer.find(`.js-${this.blockClass}__${type}`);
  }

  getSliderConfig($container: JQuery): ConfigUserList {
    return {
      input: getControlInput(this.$configContainer),
      orientation: $container.data('orientation'),
      range: JSON.parse(`[${$container.data('range')}]`),
      start: JSON.parse(`[${$container.data('start')}]`),
      step: Number($container.data('step')),
      tooltip: !!$container.data('tooltip'),
      scale: !!$container.data('scale'),
      connect: !!$container.data('connect'),
    };
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
