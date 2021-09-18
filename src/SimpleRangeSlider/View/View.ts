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

  getPointer(position: number, index: number, value: number): Pointer {
    const pointerInstance = new Pointer(
      this.$container,
      this.config.orientation,
      position,
      index,
      this.config.tooltip,
      value,
    );
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
    const pointers = positions.map(
      (position, index) => this.getPointer(position, index, values[index]),
    );
    this.entities = {
      pointers,
      connect: this.config.connect ? this.getConnect(pointers) : undefined,
      scale: this.config.scale ? this.getScale(range) : undefined,
    };
  }

  drawSlider() {
    this.entities.pointers.forEach((pointer) => {
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
    if (this.entities.connect) {
      const start = this.isSinglePointer ? 0 : positions[0];
      const end = positions[1] || positions[1] === 0
        ? positions[1]
        : positions[0];
      this.entities.connect.setPosition(start, end, this.isSinglePointer);
    }
    this.entities.pointers.forEach((pointer, i) => {
      pointer.setPositionAndUpdateTooltip(positions[i], this.config.tooltip, values[i]);
    });
    this.activePointerIndex = index;
    this.switchActivePointer();
    this.positions = positions;
    this.values = values;
  }

  updateView(viewUpdateList: ViewUpdateList) {
    if (viewUpdateList.orientation && viewUpdateList.orientation !== this.config.orientation) {
      this.updateOrientation(viewUpdateList.orientation);
    }

    if (viewUpdateList.connect !== undefined && this.config.connect !== viewUpdateList.connect) {
      this.updateConnect(viewUpdateList.connect);
    }

    if (viewUpdateList.tooltip !== undefined && this.config.tooltip !== viewUpdateList.tooltip) {
      this.config.tooltip = viewUpdateList.tooltip;
      const { tooltip, values } = viewUpdateList;
      this.entities.pointers.forEach((pointer, index) => {
        pointer.updateTooltip(tooltip, values[index]);
      });
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

    if (viewUpdateList.positions) {
      this.updatePositions(viewUpdateList.positions, viewUpdateList.values);
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
        this.entities.pointers.push(this.getPointer(positions[1], 1, values[1]!));
        this.entities.pointers[1].$element.appendTo(this.$slider);
      }
    } else if (this.entities.pointers[1]) {
      this.entities.pointers[1].$element.remove();
      this.entities.pointers.pop();
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

  updateOrientation(orientation: ConfigOrientation) {
    if (this.config.orientation !== orientation) {
      const blockClassName = 'simple-range-slider';
      this.$slider.removeClass(`${blockClassName}__slider_${this.config.orientation}`);
      this.$sliderContainer.removeClass(`${blockClassName}__slider-container_${this.config.orientation}`);
      this.config.orientation = orientation;
      this.$slider.addClass(`${blockClassName}__slider_${this.config.orientation}`);
      this.$sliderContainer.addClass(`${blockClassName}__slider-container_${this.config.orientation}`);
      this.entities.pointers.forEach((pointer) => { pointer.setOrientation(orientation); });
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
