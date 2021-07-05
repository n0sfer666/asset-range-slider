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

  $configContainer: JQuery;

  isSinglePointer: boolean;

  textInputBlocks: TextInput[] = [];

  radioBlocks: RadioBlock[] = [];

  controlButton: ControlButton;

  constructor($container: JQuery) {
    this.$mainContainer = $container;
    this.$sliderContainer = this.getContainer('slider-container');
    this.$configContainer = this.getContainer('config');
    this.sliderInstance = new SimpleRangeSlider(
      this.$sliderContainer,
      this.getSliderConfig(this.$mainContainer),
    );
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
    return this.$mainContainer.find(`.js-${this.blockClass}__${type}`) || undefined;
  }

  getSliderConfig($container: JQuery): ConfigUserList {
    const config: ConfigUserList = {
      input: getControlInput(this.$configContainer),
    };
    $.each($container.data(), (key, value) => {
      config[key] = value;
    });
    return config;
  }

  getSecondStart(): JQuery {
    let secondStart: JQuery = $(document.createElement('div'));
    this.textInputBlocks.forEach((textInput) => {
      if (textInput.configurationName === 'start') {
        secondStart = textInput.inputs[1];
      }
    });
    return secondStart;
  }
}

export default DemoPanel;
