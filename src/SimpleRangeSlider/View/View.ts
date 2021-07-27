import Connect from './entities/Connect';
import InputCheckboxTooltip from './entities/inputs/InputCheckboxTooltip';
import InputTextValue from './entities/inputs/InputTextValue';
import Pointer from './entities/Pointer';
import Scale from './entities/Scale';
import Tooltip from './entities/Tooltip';

class View {
  private $container: JQuery;

  private config: ViewConfigList;

  private $sliderContainer: JQuery;

  private $slider: JQuery;

  private positions: PointerValue;

  private values: PointerValue;

  private pointers: Pointer[];

  private isSinglePointer: boolean;

  private tooltips?: Tooltip[];

  private connect?: Connect;

  private scale?: Scale;

  private inputValues?: InputTextValue[];

  private inputTooltip?: InputCheckboxTooltip;

  private callbackList: ViewCallback[] = [];

  private activePointerIndex: number = 0;

  constructor(
    $container: JQuery,
    config: ViewConfigList,
    positions: PointerValue,
    values: PointerValue,
    range: ConfigRange,
  ) {
    this.bindContext();
    this.$container = $container;
    this.config = { ...config };
    this.positions = [...positions];
    this.values = [...values];
    this.isSinglePointer = this.positions.length === 1;
    this.initEntities(values, range);
    this.initInputs(values);
    this.drawSlider();
    this.switchActivePointer();
  }

  subscribeOn(callback: ViewCallback) {
    this.callbackList.push(callback);
  }

  getSliderElement(isContainer: boolean) {
    const className = isContainer ? 'slider' : 'slider-container';
    const $element: JQuery = jQuery(document.createElement('div'));
    $element.addClass(`simple-range-slider__${className}`);
    $element.addClass(`simple-range-slider__${className}_${this.config.orientation}`);
    return $element;
  }

  getPointer(position: number, index: number): Pointer {
    const pointerInstance = new Pointer(this.$container, this.config.orientation, position, index);
    pointerInstance.subscribeOn(this.updateByPointer);
    return pointerInstance;
  }

  getTooltip(value: number): Tooltip {
    return new Tooltip(value, this.config.orientation);
  }

  getConnect(pointers: Pointer[]): Connect {
    if (pointers.length === 1) {
      return new Connect(
        0,
        pointers[0].position,
        this.config.orientation,
        this.isSinglePointer,
      );
    }
    return new Connect(
      pointers[0].position,
      pointers[1].position,
      this.config.orientation,
      this.isSinglePointer,
    );
  }

  getScale(range: ConfigRange): Scale {
    const scaleInstance = new Scale(range, this.config.orientation);
    scaleInstance.subscribeOn(this.updateByScale);
    return scaleInstance;
  }

  initEntities(values: PointerValue, range: ConfigRange) {
    this.$sliderContainer = this.getSliderElement(false);
    this.$slider = this.getSliderElement(true);
    this.pointers = this.positions.map((position, index) => this.getPointer(position, index));
    this.tooltips = this.config.tooltip
      ? values.map((value) => this.getTooltip(value))
      : undefined;
    this.connect = this.config.connect ? this.getConnect(this.pointers) : undefined;
    this.scale = this.config.scale ? this.getScale(range) : undefined;
  }

  initInputs(inputValues: PointerValue) {
    if (this.config.input) {
      const { values, $tooltip } = this.config.input;
      if (values) {
        this.inputValues = values.map(($value, index) => {
          const value = inputValues[index] || inputValues[index] === 0 ? inputValues[index] : NaN;
          const instance = new InputTextValue($value, value, index);
          instance.subscribeOn(this.updateByInputText);
          return instance;
        });
        const isLengthNotEqual = inputValues.length !== values.length;
        if (values[1] && isLengthNotEqual) {
          values[1].hide();
        }
      }
      if ($tooltip && this.tooltips) {
        this.inputTooltip = new InputCheckboxTooltip($tooltip, this.tooltips);
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

  updateByPointer(pointerData: PointerData) {
    const { position, index } = pointerData;
    this.activePointerIndex = index;
    this.callbackList.forEach((modelCallback) => modelCallback({ index, position }));
  }

  updateByInputText(inputTextData: InputTextData) {
    const { index, value } = inputTextData;
    this.activePointerIndex = index;
    this.callbackList.forEach((modelCallback) => modelCallback({ index, value }));
  }

  updateByScale(scaleData: ScaleData) {
    const { value } = scaleData;
    if (this.isSinglePointer) {
      this.activePointerIndex = 0;
    } else {
      const difference = this.values.map((currentValue) => Math.abs(value - currentValue));
      this.activePointerIndex = difference[0] < difference[1] ? 0 : 1;
    }
    const index = this.activePointerIndex;
    this.callbackList.forEach((modelCallback) => modelCallback({ index, value }));
  }

  updateByModel(modelData: ModelData) {
    const { index, positions, values } = modelData;
    this.switchActivePointer();
    if (this.inputValues) {
      this.inputValues[index].setNewValue(values[index]);
    }
    if (this.tooltips) {
      this.tooltips[index].setValue(values[index]);
    }
    if (this.connect) {
      const start = this.isSinglePointer ? 0 : positions[0];
      const end = positions[1] || positions[1] === 0
        ? positions[1]
        : positions[0];
      this.connect.setPosition(start, end);
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
