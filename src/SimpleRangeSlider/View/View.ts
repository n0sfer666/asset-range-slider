import Connect from './entities/Connect';
import Pointer from './entities/Pointer';
import Scale from './entities/Scale';
import Tooltip from './entities/Tooltip';
import ViewEntities from './ViewEntities.type';

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
    if (this.entities.tooltip) {
      this.entities.tooltip.forEach((tooltip, i) => {
        tooltip.setValue(values[i]);
      });
    }
    if (this.entities.connect) {
      const start = this.isSinglePointer ? 0 : positions[0];
      const end = positions[1] || positions[1] === 0
        ? positions[1]
        : positions[0];
      this.entities.connect.setPosition(start, end, this.isSinglePointer);
    }
    this.entities.pointers.forEach((pointer, i) => {
      pointer.setPosition(positions[i]);
    });
    this.activePointerIndex = index;
    this.switchActivePointer();
    this.positions = positions;
    this.values = values;
  }

  updateView(viewUpdateList: ViewUpdateList) {
    if (viewUpdateList.positions) {
      this.updatePositions(viewUpdateList.positions, viewUpdateList.values);
    }

    if (viewUpdateList.orientation && viewUpdateList.orientation !== this.config.orientation) {
      this.updateOrientation(viewUpdateList.orientation);
    }

    if (viewUpdateList.connect !== undefined && this.config.connect !== viewUpdateList.connect) {
      this.updateConnect(viewUpdateList.connect);
    }

    if (viewUpdateList.tooltip !== undefined && this.config.tooltip !== viewUpdateList.tooltip) {
      this.updateTooltip(viewUpdateList.tooltip, viewUpdateList.values);
    }

    if (viewUpdateList.scale !== undefined) {
      this.updateScale(viewUpdateList.scale, viewUpdateList.range);
    }

    if (viewUpdateList.range) {
      const { range } = viewUpdateList;
      if (this.entities.scale) {
        const isRangeChanged = JSON.stringify(range) !== JSON.stringify(this.entities.scale.range);
        if (isRangeChanged) {
          this.entities.scale.updateScale(range, viewUpdateList.orientation);
        }
      }
    }
  }

  updateScale(withScale: boolean, range: ConfigRange) {
    const isScaleChange = withScale !== this.config.scale;
    if (isScaleChange) {
      this.config.scale = withScale;
      if (withScale) {
        this.entities.scale = this.getScale(range);
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

  updatePositions(positions: PointerPosition, values: PointerValue) {
    this.isSinglePointer = values.length === 1;
    const lastPointerLength = this.entities.pointers.length;
    const newPointerLength = values.length;
    if (lastPointerLength !== newPointerLength) {
      this.updatePointerAndTooltip(newPointerLength, positions, values);
    }
    this.updateByModel({ values, positions, index: 0 });
  }

  updatePointerAndTooltip(PointerLength: number, positions: PointerPosition, values: PointerValue) {
    if (PointerLength === 2) {
      const isCorrectSecondStart = values[1] || values[1] === 0;
      if (positions[1] && isCorrectSecondStart) {
        this.entities.pointers.push(this.getPointer(positions[1], 1));
        if (this.entities.tooltip) {
          this.entities.tooltip.push(this.getTooltip(
            isCorrectSecondStart
              ? values[1]!
              : NaN,
          ));
          this.entities.tooltip[1].$element.appendTo(this.entities.pointers[1].$element);
        }
        this.entities.pointers[1].$element.appendTo(this.$slider);
      }
    } else if (this.entities.pointers[1]) {
      this.entities.pointers[1].$element.remove();
      this.entities.pointers.pop();
      if (this.entities.tooltip && this.entities.tooltip[1]) {
        this.entities.tooltip.pop();
      }
    }
  }

  updateConnect(withConnect: boolean) {
    this.config.connect = withConnect;
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

  updateTooltip(withTooltip: boolean, values: PointerValue) {
    this.config.tooltip = withTooltip;
    if (this.config.tooltip) {
      this.entities.tooltip = values.map((value) => this.getTooltip(value));
      this.entities.tooltip.forEach((tooltip, index) => {
        tooltip.$element.appendTo(this.entities.pointers[index].$element);
      });
    } else if (this.entities.tooltip) {
      this.entities.tooltip.forEach((tooltip) => { tooltip.$element.remove(); });
      this.entities.tooltip = undefined;
    }
  }

  updateOrientation(orientation: ConfigOrientation) {
    if (this.config.orientation !== orientation) {
      const blockClassName = 'simple-range-slider';
      this.$slider.removeClass(`${blockClassName}__slider_${this.config.orientation}`);
      this.$sliderContainer.removeClass(`${blockClassName}__slider-container_${this.config.orientation}`);
      this.config.orientation = orientation;
      this.$slider.addClass(`${blockClassName}__slider_${this.config.orientation}`);
      this.$sliderContainer.addClass(`${blockClassName}__slider-container_${this.config.orientation}`);
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
  }

  bindContext() {
    this.updateByScale = this.updateByScale.bind(this);
    this.updateByPointer = this.updateByPointer.bind(this);
  }
}

export default View;
