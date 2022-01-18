import ControlButton from '../control-button/control-button';
import getControlButton from '../control-button/getControlButton';
import getRadioBlocks from '../radio-block/getRadioBlocks';
import RadioBlock from '../radio-block/radio-block';
import TextInput from '../text-input-block/text-input-block';
import getTextInputBlocks from '../text-input-block/getTextInputBlocks';
import Presenter from '../../SimpleRangeSlider/Presenter/Presenter';

const classes = {
  root: 'demo-panel',
};

class DemoPanel {
  $mainContainer: JQuery;

  $sliderContainer: JQuery;

  $configContainer: JQuery;

  textInputBlocks: TextInput[] = [];

  radioBlocks: RadioBlock[] = [];

  controlButton: ControlButton;

  constructor($container: JQuery) {
    this.$mainContainer = $container;
    this.initContainers();
    this.$sliderContainer.simpleRangeSlider();
    this.bindContext();
    this.initBlocks();
  }

  getContainer(type: 'slider-container' | 'config'): JQuery {
    return this.$mainContainer.find(`.js-${classes.root}__${type}`);
  }

  getSecondValue(): JQuery {
    const values = this.textInputBlocks.find((block) => block.configurationName === 'values')?.inputs;
    return values ? values[values.length - 1] : jQuery('<input />');
  }

  initContainers() {
    this.$sliderContainer = this.getContainer('slider-container');
    this.$configContainer = this.getContainer('config');
  }

  initBlocks() {
    this.textInputBlocks = getTextInputBlocks(this.$configContainer, this.$sliderContainer);
    this.radioBlocks = getRadioBlocks(this.$configContainer, this.$sliderContainer);
    this.controlButton = getControlButton(
      this.$configContainer,
      this.getSecondValue(),
      this.$sliderContainer,
    );
    const instance: Presenter = this.$sliderContainer.data('SimpleRangeSlider');
    instance.updateSlider({}, this.callbackValueInputChange);
  }

  callbackValueInputChange(modelData: ModelData) {
    const { values, index } = modelData;
    const value = values[index];
    const valueInputs: JQuery[] = [];
    this.textInputBlocks.forEach((block) => {
      if (block.configurationName === 'values') {
        block.inputs.forEach((input) => valueInputs.push(input));
      }
    });
    if (typeof value === 'number') {
      valueInputs[index].val(value);
    }
  }

  bindContext() {
    this.callbackValueInputChange = this.callbackValueInputChange.bind(this);
  }
}

export default DemoPanel;
