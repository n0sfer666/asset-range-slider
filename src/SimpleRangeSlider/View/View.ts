import Connect from './entities/Connect';
import InputCheckboxTooltip from './entities/inputs/InputCheckboxTooltip';
import InputTextValue from './entities/inputs/InputTextValue';
import Pointer from './entities/Pointer';
import Scale from './entities/Scale';
import Tooltip from './entities/Tooltip';

class View {
  $container: JQuery;

  config: iConfigView;

  $sliderContainer: JQuery;

  $slider: JQuery;

  pointers: Pointer[];

  tooltips?: Tooltip[];

  connect?: Connect;

  scale?: Scale;

  inputValue?: InputTextValue[];

  inputTooltip?: InputCheckboxTooltip;

  callbackList: iViewCallback[] = [];

  positions: number[];

  values: number[];

  activePointerIndex: number = 0;

  constructor($container: JQuery, config: iConfigView, position: number[]) {
    this.$container = $container;
    this.config = config;
    this.values = config.start;
    this.positions = position;
    this.bindContext();
    this.$sliderContainer = this.getSliderElement(false);
    this.$slider = this.getSliderElement(true);
    this.pointers = this.positions.map((pos, index) => this.getPointer(pos, index));
    this.pointers.forEach((pointer) => pointer.subscribeOn(this.onChangePosition));
    this.tooltips = this.config.tooltip
      ? this.values.map((value) => this.getTooltip(value))
      : undefined;
    this.connect = this.config.connect ? this.getConnect(this.pointers) : undefined;
    this.scale = this.config.scale ? this.getScale() : undefined;
    this.initInputs();
    this.drawSlider();
    this.pointers.forEach(
      (pointer, index) => pointer.switchActive(index === this.activePointerIndex),
    );
  }

  onChangePosition(pointerData: tPointerData) {
    const { index, position } = pointerData;
    console.log(`${index}: ${position}`);
  }

  subscribeOn(callback: iViewCallback) {
    this.callbackList.push(callback);
  }

  getSliderElement(isContainer: boolean) {
    const className = isContainer ? 'slider' : 'slider-container';
    const element: JQuery = jQuery(document.createElement('div'));
    element.addClass(`simple-range-slider__${className}`);
    element.addClass(`simple-range-slider__${className}_${this.config.orientation}`);
    return element;
  }

  getPointer(position: number, index: number): Pointer {
    const pointerInstance = new Pointer(this.$container, this.config.orientation, position, index);
    pointerInstance.subscribeOn(this.updateViewByPointer);
    return pointerInstance;
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

  getScale(): Scale {
    const scaleInstance = new Scale(this.config.range, this.config.orientation);
    scaleInstance.subscribeOn(this.updateViewByScale);
    return scaleInstance;
  }

  initInputs() {
    if (this.config.input) {
      if (this.config.input.$value) {
        this.inputValue = this.config.input.$value.map(($inputValue, index) => {
          const instance = new InputTextValue($inputValue, this.config.start[index], index);
          instance.subscribeOn(this.updateViewByInputText);
          return instance;
        });
      }
      if (this.config.input.$tooltip && this.tooltips) {
        this.inputTooltip = new InputCheckboxTooltip(this.config.input.$tooltip, this.tooltips);
      }
    }
  }

  drawSlider() {
    this.pointers.forEach((pointer, index) => {
      if (this.tooltips) {
        pointer.$element.append(this.tooltips[index].$element);
      }
      this.$slider.append(pointer.$element);
    });
    if (this.connect) {
      this.$slider.append(this.connect.$element);
    }
    if (this.scale) {
      if (this.config.orientation === 'vertical') {
        this.$sliderContainer.append(this.scale.$element);
        this.$sliderContainer.append(this.$slider);
      } else {
        this.$sliderContainer.append(this.$slider);
        this.$sliderContainer.append(this.scale.$element);
      }
    } else {
      this.$sliderContainer.append(this.$slider);
    }
    this.$container.append(this.$sliderContainer);
  }

  updateViewByPointer(pointerData: tPointerData) {
    const { position, index } = pointerData;
    this.activePointerIndex = index;
    this.positions[index] = position;
  }

  updateViewByInputText(inputTextData: tInputTextData) {
    const { index, value } = inputTextData;
    this.values[index] = value;
    this.activePointerIndex = index;
  }

  updateViewByScale(scaleData: tScaleData) {
    const { position } = scaleData;
    if (this.positions.length === 1) {
      this.positions[0] = position;
    } else {
      const difference = this.positions.map((currentPosition) => {
        const result = Math.round((position - currentPosition) * 1e4) / 1e4;
        return Math.abs(result);
      });
      if (difference[0] <= difference[1]) {
        this.positions[0] = position;
      } else {
        this.positions[1] = position;
      }
    }
  }

  bindContext() {
    this.updateViewByInputText = this.updateViewByInputText.bind(this);
    this.updateViewByScale = this.updateViewByScale.bind(this);
    this.updateViewByPointer = this.updateViewByPointer.bind(this);
  }
}

export default View;
