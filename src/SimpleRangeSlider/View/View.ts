import Connect from './entities/Connect';
import InputTextValue from './entities/inputs/InputTextValue';
import Pointer from './entities/Pointer';
import Scale from './entities/Scale';
import Tooltip from './entities/Tooltip';
import { ViewEntities, ViewEntitiesInput } from './ViewEntities.type';

class View {
  private $container: JQuery;

  private config: ViewConfigList;

  private $sliderContainer: JQuery;

  private $slider: JQuery;

  private positions: PointerPosition;

  private values: PointerValue;

  private isSinglePointer: boolean;

  private entities: ViewEntities;

  private callbackList: ViewCallback[] = [];

  private activePointerIndex: number = 0;

  constructor(
    $container: JQuery,
    config: ViewConfigList,
    positions: PointerPosition,
    values: PointerValue,
    range: ConfigRange,
  ) {
    this.bindContext();
    this.$container = $container;
    this.config = { ...config };
    this.positions = [...positions];
    this.values = [...values];
    this.isSinglePointer = this.positions.length === 1;
    this.initEntities(this.positions, this.values, [...range]);
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

  initEntities(positions: PointerPosition, values: PointerValue, range: ConfigRange) {
    if (!this.$sliderContainer && !this.$slider) {
      this.$sliderContainer = this.getSliderElement(false);
      this.$slider = this.getSliderElement(true);
    }
    const pointers = positions.map((position, index) => this.getPointer(position, index));
    const tooltip = this.config.tooltip ? values.map((value) => this.getTooltip(value)) : undefined;
    this.entities = {
      pointers,
      tooltip,
      connect: this.config.connect ? this.getConnect(pointers) : undefined,
      scale: this.config.scale ? this.getScale(range) : undefined,
      input: this.getInputs(values, this.config.input),
    };
  }

  getInputs(
    inputValues: PointerValue,
    input?: ConfigInputs,
  ): ViewEntitiesInput {
    if (input) {
      const values = input.values
        ? input.values.map(($value, index) => new InputTextValue(
          $value,
          inputValues[index] !== undefined ? inputValues[index] : NaN,
          index,
        ))
        : undefined;
      if (values) {
        const isDifferentAmount = inputValues.length !== values.length;
        if (isDifferentAmount) {
          values[values.length - 1].$element.hide();
        }
        values.forEach((inputTextValue) => {
          inputTextValue.subscribeOn(this.updateByInputText);
        });
      }
      return {
        values,
      };
    }
    return {
      values: undefined,
    };
  }

  drawSlider() {
    this.entities.pointers.forEach((pointer, index) => {
      if (this.entities.tooltip) {
        pointer.$element.append(this.entities.tooltip[index].$element);
      }
      this.$slider.append(pointer.$element);
    });
    if (this.entities.connect) {
      this.$slider.append(this.entities.connect.$element);
    }
    if (this.entities.scale) {
      if (this.config.orientation === 'vertical') {
        this.$sliderContainer.append(this.entities.scale.$element, this.$slider);
      } else {
        this.$sliderContainer.append(this.$slider, this.entities.scale.$element);
      }
    } else {
      this.$sliderContainer.append(this.$slider);
    }
    this.$container.append(this.$sliderContainer);
  }

  switchActivePointer() {
    this.entities.pointers.forEach(
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
    if (this.entities.input && this.entities.input.values) {
      this.entities.input.values[index].setNewValue(values[index]);
    }
    if (this.entities.tooltip) {
      this.entities.tooltip[index].setValue(values[index]);
    }
    if (this.entities.connect) {
      const values = this.isSinglePointer ? 0 : positions[0];
      const end = positions[1] || positions[1] === 0
        ? positions[1]
        : positions[0];
      this.entities.connect.setPosition(values, end);
    }
    this.entities.pointers[index].setPosition(positions[index]);
    this.activePointerIndex = index;
    this.positions = positions;
    this.values = values;
  }

  updateView(viewUpdateList: ViewUpdateList) {
    if (viewUpdateList.values && viewUpdateList.positions) {
      this.positions = [...viewUpdateList.positions];
      this.isSinglePointer = this.positions.length === 1;
      const lastPointerLength = this.entities.pointers.length;
      const newPointerLength = viewUpdateList.values.length;
      viewUpdateList.values.forEach((value, index) => {
        if (this.entities.input && this.entities.input.values) {
          this.entities.input.values[index].setNewValue(value);
        }
      });
      if (lastPointerLength !== newPointerLength) {
        if (newPointerLength === 2) {
          const isCorrectSecondStart = viewUpdateList.values[1] || viewUpdateList.values[1] === 0;
          if (viewUpdateList.positions[1] && isCorrectSecondStart) {
            this.entities.pointers.push(this.getPointer(viewUpdateList.positions[1], 1));
            if (this.entities.tooltip) {
              this.entities.tooltip.push(this.getTooltip(viewUpdateList.values[1]!));
              this.entities.tooltip[1].$element.appendTo(this.entities.pointers[1].$element);
            }
            if (this.entities.input && this.entities.input.values) {
              if (this.entities.input.values[1]) {
                this.entities.input.values[1].$element.show();
              }
            }
            this.entities.pointers[1].$element.appendTo(this.$slider);
          }
        } else if (this.entities.pointers[1]) {
          this.entities.pointers[1].$element.remove();
          this.entities.pointers.pop();
          if (this.entities.tooltip && this.entities.tooltip[1]) {
            this.entities.tooltip.pop();
          }
          if (this.entities.input && this.entities.input.values) {
            if (this.entities.input.values[1]) {
              this.entities.input.values[1].$element.hide();
            }
          }
        }
      }
      this.positions.forEach((position, index) => {
        this.entities.pointers[index].setPosition(position);
        if (this.entities.tooltip && viewUpdateList.values) {
          this.entities.tooltip[index].setValue(viewUpdateList.values[index]);
        }
      });
      if (this.entities.connect) {
        this.entities.connect.setPosition(
          this.isSinglePointer ? 0 : this.positions[0],
          this.positions[1] || this.positions[1] === 0
            ? this.positions[1]
            : this.positions[0],
          this.isSinglePointer,
        );
      }
    }

    if (viewUpdateList.orientation && viewUpdateList.orientation !== this.config.orientation) {
      this.setOrientation(viewUpdateList.orientation);
      const { orientation } = this.config;
      this.entities.pointers.forEach((pointer) => { pointer.setOrientation(orientation); });
      if (this.entities.tooltip) {
        this.entities.tooltip.forEach((tooltip) => { tooltip.setOrientation(orientation); });
      }
      if (this.entities.connect) {
        this.entities.connect.setOrientation(orientation);
      }
      if (this.entities.scale) {
        this.entities.scale.setOrientation(orientation);
        if (orientation === 'vertical') {
          this.entities.scale.$element.prependTo(this.$sliderContainer);
        } else {
          this.$slider.prependTo(this.$sliderContainer);
        }
      }
    }

    if (viewUpdateList.connect !== undefined && this.config.connect !== viewUpdateList.connect) {
      this.config.connect = viewUpdateList.connect;
      if (this.config.connect) {
        this.entities.connect = this.getConnect(this.entities.pointers);
        this.entities.connect.$element.appendTo(this.$slider);
      } else {
        if (this.entities.connect) {
          this.entities.connect.$element.remove();
        }
        this.entities.connect = undefined;
      }
    }

    if (viewUpdateList.tooltip !== undefined && this.config.tooltip !== viewUpdateList.tooltip) {
      this.config.tooltip = viewUpdateList.tooltip;
      if (this.config.tooltip) {
        if (viewUpdateList.values) {
          this.entities.tooltip = viewUpdateList.values.map((value) => this.getTooltip(value));
          this.entities.tooltip.forEach((tooltip, index) => {
            tooltip.$element.appendTo(this.entities.pointers[index].$element);
          });
        }
      } else if (this.entities.tooltip) {
        this.entities.tooltip.forEach((tooltip) => { tooltip.$element.remove(); });
        this.entities.tooltip = undefined;
      }
    }

    if (viewUpdateList.scale !== undefined && this.config.scale !== viewUpdateList.scale) {
      this.config.scale = viewUpdateList.scale;
      if (viewUpdateList.range) {
        if (this.config.scale) {
          this.entities.scale = this.getScale(viewUpdateList.range);
          if (this.config.orientation === 'horizontal') {
            this.entities.scale.$element.appendTo(this.$sliderContainer);
          } else {
            this.entities.scale.$element.prependTo(this.$sliderContainer);
          }
        } else {
          if (this.entities.scale) {
            this.entities.scale.$element.remove();
          }
          this.entities.scale = undefined;
        }
      }
    }

    if (viewUpdateList.range) {
      const { range } = viewUpdateList;
      const isRangeChange = this.entities.scale && this.entities.scale.range !== range;
      if (this.entities.scale && isRangeChange) {
        this.entities.scale.updateScale(range, viewUpdateList.orientation);
      }
    }
  }

  setOrientation(orientation: ConfigOrientation) {
    if (this.config.orientation !== orientation) {
      const blockClassName = 'simple-range-slider';
      this.$slider.removeClass(`${blockClassName}__slider_${this.config.orientation}`);
      this.$sliderContainer.removeClass(`${blockClassName}__slider-container_${this.config.orientation}`);
      this.config.orientation = orientation;
      this.$slider.addClass(`${blockClassName}__slider_${this.config.orientation}`);
      this.$sliderContainer.addClass(`${blockClassName}__slider-container_${this.config.orientation}`);
    }
  }

  bindContext() {
    this.updateByInputText = this.updateByInputText.bind(this);
    this.updateByScale = this.updateByScale.bind(this);
    this.updateByPointer = this.updateByPointer.bind(this);
  }
}

export default View;
