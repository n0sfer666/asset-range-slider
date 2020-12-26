import Connect from './entities/Connect';
import InputCheckboxTooltip from './entities/inputs/InputCheckboxTooltip';
import InputTextValue from './entities/inputs/InputTextValue';
import Pointer from './entities/Pointer';
import Tooltip from './entities/Tooltip';

class View {
  readonly normalizingCoefficient: number = 1e4;

  $container: JQuery;

  config: iConfigView;

  $slider: JQuery;

  pointer: Pointer[];

  tooltips?: Tooltip[];

  connect?: Connect;

  inputValue?: InputTextValue[];

  inputTooltip?: InputCheckboxTooltip;

  constructor($container: JQuery, config: iConfigView) {
    this.$container = $container;
    this.config = config;
    this.$slider = this.getSlider();
    this.pointer = this.config.start.map((value, index) => this.getPointer(value, index));
    this.tooltips = this.config.tooltip
      ? this.config.start.map((value) => this.getTooltip(value))
      : undefined;
    this.connect = this.config.connect ? this.getConnect(this.pointer) : undefined;
    this.initInputs();
    this.drawSlider();
  }

  getSlider() {
    const element: JQuery = jQuery(document.createElement('div'));
    element.addClass('simple-range-slider__slider');
    element.addClass(`simple-range-slider__slider_${this.config.orientation}`);
    return element;
  }

  getPointer(value: number, index: number): Pointer {
    const { range } = this.config;
    const position: number = (value - range[0]) / (range[1] - range[0]);
    const normalizedPosition: number = this.getNormalizedPosition(position);
    return new Pointer(this.$container, this.config.orientation, normalizedPosition, index);
  }

  getTooltip(value: number): Tooltip {
    return new Tooltip(value, this.config.orientation);
  }

  getConnect(pointer: Pointer[]): Connect {
    if (pointer.length === 1) {
      return new Connect(0, pointer[0].position, this.config.orientation);
    }
    return new Connect(pointer[0].position, pointer[1].position, this.config.orientation);
  }

  initInputs() {
    if (this.config.input) {
      if (this.config.input.$value) {
        this.inputValue = this.config.input.$value.map(
          ($inputValue, index) => new InputTextValue($inputValue, this.config.start[index], index),
        );
      }
      if (this.config.input.$tooltip && this.tooltips) {
        this.inputTooltip = new InputCheckboxTooltip(this.config.input.$tooltip, this.tooltips);
      }
    }
  }

  getNormalizedPosition(position: number):number {
    return Math.round(position * this.normalizingCoefficient);
  }

  drawSlider() {
    this.pointer.forEach((pointer, index) => {
      if (this.tooltips) {
        pointer.$element.append(this.tooltips[index].$element);
      }
      this.$slider.append(pointer.$element);
    });
    if (this.connect) {
      this.$slider.append(this.connect.$element);
    }
    this.$container.append(this.$slider);
  }
}

export default View;
