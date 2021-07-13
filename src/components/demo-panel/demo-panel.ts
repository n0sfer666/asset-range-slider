import '../../SimpleRangeSlider/SimpleRangeSliderJQ';
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

  $configContainer: JQuery;

  sliderConfig: CompleteConfigList;

  isSinglePointer: boolean;

  textInputBlocks: TextInput[] = [];

  radioBlocks: RadioBlock[] = [];

  controlButton: ControlButton;

  constructor($container: JQuery) {
    this.$mainContainer = $container;
    this.initContainers();
    const input: ConfigInputs = getControlInput(this.$configContainer);
    this.$sliderContainer.simpleRangeSlider({ input: getControlInput(this.$configContainer) });
    this.sliderConfig = this.getCompleteSliderConfig(input);
    this.isSinglePointer = this.sliderConfig.start.length === 1;
    this.initBlocks();
  }

  getContainer(type: 'slider-container' | 'config'): JQuery {
    return this.$mainContainer.find(`.js-${this.blockClass}__${type}`) || undefined;
  }

  getCompleteSliderConfig(input?: ConfigInputs): CompleteConfigList {
    const config: ConfigUserList = { input };
    $.each(this.$sliderContainer.data(), (key, value) => {
      config[key] = value;
    });
    return <CompleteConfigList> config;
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

  initContainers() {
    this.$sliderContainer = this.getContainer('slider-container');
    this.$configContainer = this.getContainer('config');
  }

  initBlocks() {
    this.textInputBlocks = getTextInputBlocks(
      this.$configContainer,
      this.$sliderContainer,
      this.sliderConfig,
      this.isSinglePointer,
    );
    this.radioBlocks = getRadioBlocks(
      this.$configContainer,
      this.$sliderContainer,
      this.sliderConfig,
    );
    this.controlButton = getControlButton(
      this.$configContainer,
      this.getSecondStart(),
      this.$sliderContainer,
      this.sliderConfig,
      this.isSinglePointer,
    );
  }
}

export default DemoPanel;
