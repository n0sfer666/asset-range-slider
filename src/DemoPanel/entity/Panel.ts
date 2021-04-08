import SimpleRangeSlider from '../../SimpleRangeSlider/SimpleRangeSlider';
import Drawing from './Drawing';

class Panel extends Drawing {
  config: iCompleteConfig;

  isHorizontal: boolean;

  isSinglePointer: boolean;

  inputs: iDemoArrayElements;

  containers: iDemoSingleElements;

  mainContainers: iDemoSingleElements;

  titles: iDemoSingleElements;

  $buttonPointerCountControl: JQuery;

  $inputCheckboxTooltip: JQuery;

  slider: SimpleRangeSlider;

  constructor(config: iCompleteConfig) {
    super();
    this.config = config;
    this.isSinglePointer = config.start.length === 1;
    this.isHorizontal = this.config.orientation === 'horizontal';
    this.titles = this.getTitles();
    this.mainContainers = this.getMainContainers();
    this.containers = this.getContainers();
    this.inputs = this.getInputs();
    this.$buttonPointerCountControl = this.getButtonElement(this.isSinglePointer);
    this.$inputCheckboxTooltip = this.getCheckboxElement(this.config.tooltip, 'show/hidden tooltip');
    this.initPanel();
    this.slider = new SimpleRangeSlider(this.mainContainers.$slider, this.config);
  }

  getInputs(): iDemoArrayElements {
    return {
      $control: this.config.start.map((value) => this.getConfigInputElement(value)),
      $orientation: [
        this.getRadioElement('horizontal', 'orientation', this.isHorizontal),
        this.getRadioElement('vertical', 'orientation', !this.isHorizontal),
      ],
      $range: this.config.range.map((value) => this.getConfigInputElement(value)),
      $start: this.config.start.map((value) => this.getConfigInputElement(value)),
      $step: [this.getConfigInputElement(this.config.step)],
      $scale: [
        this.getRadioElement('enable', 'scale', this.config.scale),
        this.getRadioElement('disable', 'scale', !this.config.scale),
      ],
      $connect: [
        this.getRadioElement('enable', 'connect', this.config.connect),
        this.getRadioElement('disable', 'connect', !this.config.connect),
      ],
      $tooltip: [
        this.getRadioElement('enable', 'tooltip', this.config.tooltip),
        this.getRadioElement('disable', 'tooltip', !this.config.tooltip),
      ],
    };
  }

  getContainers(): iDemoSingleElements {
    return {
      $control: this.getContainerElement(),
      $orientation: this.getContainerElement(),
      $range: this.getContainerElement(),
      $start: this.getContainerElement(),
      $step: this.getContainerElement(),
      $scale: this.getContainerElement(),
      $connect: this.getContainerElement(),
      $tooltip: this.getContainerElement(),
    };
  }

  getMainContainers(): iDemoSingleElements {
    return {
      $main: this.getContainerElement('main'),
      $slider: this.getContainerElement('slider'),
      $config: this.getContainerElement('config'),
    };
  }

  getTitles(): iDemoSingleElements {
    return {
      $main: this.getTextElement({ isTitle: true, text: 'Demo Panel' }),
      $slider: this.getTextElement({ isTitle: true, text: 'Slider' }),
      $config: this.getTextElement({ isTitle: true, text: 'Config' }),
      $control: this.getTextElement({ text: 'control' }),
      $orientation: this.getTextElement({ text: 'orientation' }),
      $range: this.getTextElement({ text: 'range' }),
      $start: this.getTextElement({ text: 'start' }),
      $step: this.getTextElement({ text: 'step' }),
      $scale: this.getTextElement({ text: 'scale' }),
      $connect: this.getTextElement({ text: 'connect' }),
      $tooltip: this.getTextElement({ text: 'tooltip' }),
    };
  }

  initPanel() {
    $.each(this.titles, (key, element) => {
      if (this.mainContainers[key]) {
        this.mainContainers[key].append(this.titles[key]);
      } else {
        this.containers[key].append(this.titles[key]);
        this.inputs[key].forEach((inputElement) => {
          this.containers[key].append(inputElement);
        });
        this.mainContainers.$config.append(this.containers[key]);
      }
      if (key === '$start') {
        this.containers[key].append(this.$buttonPointerCountControl);
      }
    });
    this.containers.$control.append(this.$inputCheckboxTooltip);
    this.config.input = {
      $value: this.inputs.$control,
      $tooltip: this.$inputCheckboxTooltip,
    };
    this.mainContainers.$main.append(this.mainContainers.$slider, this.mainContainers.$config);
  }
}

export default Panel;
