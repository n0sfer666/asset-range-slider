import SimpleRangeSlider from '../../SimpleRangeSlider/SimpleRangeSlider';
import Drawing from './Drawing';

class Panel extends Drawing {
  config: iCompleteConfig;

  isHorizontal: boolean;

  isSinglePointer: boolean;

  inputs: iInputs;

  containers: iContainers;

  mainContainers: iMainContainers;

  titles: iTitles;

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
    this.bindContext();
    this.$buttonPointerCountControl = this.getButtonControlElement(this.isSinglePointer);
    this.$buttonPointerCountControl.on('click', this.handleButtonControlClick);
    this.$inputCheckboxTooltip = this.getCheckboxElement(this.config.tooltip, 'show/hidden tooltip');
    this.initPanel();
    this.slider = new SimpleRangeSlider(this.mainContainers.$slider, this.config);
  }

  getInputs(): iInputs {
    return {
      $control: this.config.start.map((value, index) => this.getConfigInputElement(value, index)),
      $orientation: [
        this.getRadioElement('horizontal', 'orientation', this.isHorizontal),
        this.getRadioElement('vertical', 'orientation', !this.isHorizontal),
      ],
      $range: this.config.range.map((value, index) => this.getConfigInputElement(value, index, 'range')),
      $start: this.config.start.map((value, index) => this.getConfigInputElement(value, index, 'start')),
      $step: [this.getConfigInputElement(this.config.step, 0, 'step')],
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

  getContainers(): iContainers {
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

  getMainContainers(): iMainContainers {
    return {
      $main: this.getContainerElement('main'),
      $slider: this.getContainerElement('slider'),
      $config: this.getContainerElement('config'),
    };
  }

  getTitles(): iTitles {
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
        this.inputs[key].forEach((inputElement: JQuery) => {
          const tagName = inputElement.prop('tagName');
          if (tagName === 'LABEL') {
            inputElement.find('input[type=radio]').on('click', this.handleRadioClick);
          }
          if (tagName === 'INPUT') {
            inputElement.on('focusout', this.handleInputFocusout);
          }
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
      $values: this.inputs.$control,
      $tooltip: this.$inputCheckboxTooltip.find('input'),
    };
    this.mainContainers.$main.append(this.mainContainers.$slider, this.mainContainers.$config);
  }

  rebuildSlider() {
    this.mainContainers.$slider.empty();
    this.mainContainers.$slider.append(this.titles.$slider);
    this.slider = new SimpleRangeSlider(this.mainContainers.$slider, this.config);
  }

  handleRadioClick(event: JQuery.MouseEventBase) {
    const $target = $(event.target);
    if ($target.prop('tagName') === 'INPUT') {
      const name = $target.prop('name');
      if (name === 'orientation') {
        this.config[name] = $target.parent().text();
      } else {
        this.config[name] = $target.parent().text() === 'enable';
      }
      this.rebuildSlider();
    }
  }

  handleInputFocusout(event: JQuery.FocusOutEvent) {
    const $target = $(event.target);
    const splitString = $target.prop('name').split('-');
    const name = splitString[0];
    const index = Number(splitString[1]);
    const value = Number($target.val());
    switch (name) {
      case 'start': {
        if (this.isSinglePointer) {
          const isStartOutOfRange = value < this.config.range[0] || value > this.config.range[1];
          if (!isStartOutOfRange) {
            this.config[name][index] = value;
            this.rebuildSlider();
          } else {
            console.error('wrong value');
            $target.val(this.config.start[index]);
          }
        } else if (this.config.start[1]) {
          const isStartOutOfRange = index === 0
            ? value < this.config.range[0] || value > this.config.start[1]
            : value < this.config.start[0] || value > this.config.range[1];
          const isEqualAnotherStart = index === 0
            ? value === this.config.start[1]
            : value === this.config.start[0];
          if (!isStartOutOfRange && !isEqualAnotherStart) {
            this.config[name][index] = value;
            this.rebuildSlider();
          } else {
            console.error('wrong value');
            $target.val(this.config[name][index]);
          }
        }
        break;
      }
      case 'range': {
        if (this.isSinglePointer) {
          const isRangeOutOfStart = index === 0
            ? value > this.config.start[0]
            : value < this.config.start[0];
          const isNotRange = index === 0
            ? value === this.config.range[1]
            : value === this.config.range[0];
          if (!isRangeOutOfStart && !isNotRange) {
            this.config[name][index] = value;
            this.rebuildSlider();
          } else {
            console.error('wrong value');
            $target.val(this.config[name][index]);
          }
        } else {
          const isRangeOutOfStart = index === 0
            ? value > this.config.start[index]
            : value < this.config.start[index];
          const isNotRange = index === 0
            ? value === this.config.range[1]
            : value === this.config.range[0];
          if (!isRangeOutOfStart && !isNotRange) {
            this.config[name][index] = value;
            this.rebuildSlider();
          } else {
            console.error('wrong value');
            $target.val(this.config[name][index]);
          }
        }
        break;
      }
      case 'step': {
        this.config.step = value;
        this.rebuildSlider();
        break;
      }
      default: {
        break;
      }
    }
  }

  handleButtonControlClick(event: JQuery.MouseEventBase) {
    const $target = $(event.target);
    if (this.isSinglePointer) {
      const nextValue = this.config.start[0] + this.config.step;
      if (nextValue <= this.config.range[1]) {
        this.config.start.push(nextValue);
        $target.text('-');
        this.isSinglePointer = false;
      }
    } else {
      this.config.start.pop();
      $target.text('+');
      this.isSinglePointer = true;
    }
    this.containers.$control.find('input[type=text]').remove();
    this.containers.$start.find('input').remove();
    this.inputs.$control = this.config.start.map(
      (value, index) => this.getConfigInputElement(value, index)
        .insertBefore(this.$inputCheckboxTooltip),
    );
    this.inputs.$start = this.config.start.map(
      (value, index) => this.getConfigInputElement(value, index, 'start')
        .insertBefore(this.$buttonPointerCountControl),
    );
    if (this.config.input) {
      this.config.input.$values = this.inputs.$control;
    }
    this.rebuildSlider();
  }

  bindContext() {
    this.handleRadioClick = this.handleRadioClick.bind(this);
    this.handleInputFocusout = this.handleInputFocusout.bind(this);
    this.handleButtonControlClick = this.handleButtonControlClick.bind(this);
  }
}

export default Panel;
