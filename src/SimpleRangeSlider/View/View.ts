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

  isSinglePointer: boolean;

  tooltips?: Tooltip[];

  connect?: Connect;

  scale?: Scale;

  inputValue?: InputTextValue[];

  inputTooltip?: InputCheckboxTooltip;

  callbackList: iViewCallback[] = [];

  positions: number[];

  values: number[];

  range: tRange;

  activePointerIndex: number = 0;

  constructor($container: JQuery, config: iConfigView, positions: number[]) {
    this.$container = $container;
    this.config = config;
    this.values = this.config.start;
    this.range = this.config.range;
    this.positions = positions;
    this.isSinglePointer = this.values.length === 1;
    this.bindContext();
    this.$sliderContainer = this.getSliderElement(false);
    this.$slider = this.getSliderElement(true);
    this.pointers = this.positions.map((pos, index) => this.getPointer(pos, index));
    this.tooltips = this.config.tooltip
      ? this.values.map((value) => this.getTooltip(value))
      : undefined;
    this.connect = this.config.connect ? this.getConnect(this.pointers) : undefined;
    this.scale = this.config.scale ? this.getScale() : undefined;
    this.initInputs();
    this.drawSlider();
    this.switchActivePointer();
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
    pointerInstance.subscribeOn(this.updateByPointer);
    return pointerInstance;
  }

  getTooltip(value: number): Tooltip {
    return new Tooltip(value, this.config.orientation);
  }

  getConnect(pointer: Pointer[]): Connect {
    if (pointer.length === 1) {
      return new Connect(
        0,
        pointer[0].position,
        this.config.orientation,
        this.isSinglePointer,
      );
    }
    return new Connect(
      pointer[0].position,
      pointer[1].position,
      this.config.orientation,
      this.isSinglePointer,
    );
  }

  getScale(): Scale {
    const scaleInstance = new Scale(this.config.range, this.config.orientation);
    scaleInstance.subscribeOn(this.updateByScale);
    return scaleInstance;
  }

  initInputs() {
    if (this.config.input) {
      if (this.config.input.$value) {
        this.inputValue = this.config.input.$value.map(($inputValue, index) => {
          const instance = new InputTextValue($inputValue, this.config.start[index], index);
          instance.subscribeOn(this.updateByInputText);
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

  switchActivePointer() {
    this.pointers.forEach(
      (pointer, index) => pointer.switchActive(index === this.activePointerIndex),
    );
  }

  updateByPointer(pointerData: tPointerData) {
    const { position, index } = pointerData;
    this.activePointerIndex = index;
    this.callbackList.forEach((modelCallback) => modelCallback({ index, position }));
  }

  updateByInputText(inputTextData: tInputTextData) {
    const { index, value } = inputTextData;
    this.activePointerIndex = index;
    this.callbackList.forEach((modelCallback) => modelCallback({ index, value }));
  }

  updateByScale(scaleData: tScaleData) {
    const { position } = scaleData;
    if (this.positions.length === 1) {
      this.positions[0] = position;
      this.activePointerIndex = 0;
    } else {
      const difference = this.positions.map((currentPosition) => {
        const result = Math.round((position - currentPosition) * 1e4) / 1e4;
        return Math.abs(result);
      });
      this.activePointerIndex = difference[0] < difference[1] ? 0 : 1;
    }
    this.callbackList.forEach((modelCallback) => modelCallback({
      index: this.activePointerIndex,
      position,
    }));
  }

  updateByModel(modelData: tModelData) {
    const { index, positions, values } = modelData;
    this.switchActivePointer();
    if (this.inputValue) {
      this.inputValue[index].setNewValue(values[index]);
    }
    if (this.tooltips) {
      this.tooltips[index].setValue(values[index]);
    }
    if (this.connect) {
      this.connect.setPosition(
        this.isSinglePointer ? 0 : positions[0],
        this.isSinglePointer ? positions[0] : positions[1],
      );
    }
    this.pointers[index].setPosition(positions[index]);
    this.activePointerIndex = index;
    this.positions = positions;
    this.values = values;
  }

  bindContext() {
    this.updateByInputText = this.updateByInputText.bind(this);
    this.updateByScale = this.updateByScale.bind(this);
    this.updateByPointer = this.updateByPointer.bind(this);
  }
}

export default View;
