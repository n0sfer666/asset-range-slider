import Connect from './entities/Connect';
import Pointer from './entities/Pointer';
import Scale from './entities/Scale';
import ViewEntities from './ViewEntities.type';

const classes = {
  root: 'simple-range-slider',
  slider: 'simple-range-slider__slider',
  sliderContainer: 'simple-range-slider__slider-container',
};

class View {
  private $container: JQuery;

  private config: CompleteConfigList;

  private $sliderContainer: JQuery;

  private $slider: JQuery;

  private positions: PointerPosition;

  private isSinglePointer: boolean;

  private entities: ViewEntities;

  private callbackList: ViewCallback[] = [];

  private activePointerIndex: number = 0;

  constructor($container: JQuery, config: CompleteConfigList, positions: PointerPosition) {
    this.bindContext();
    this.$container = $container;
    this.config = { ...config };
    this.positions = [...positions];
    this.isSinglePointer = this.positions.length === 1;
    this.initEntities(this.positions, this.config.values, [...this.config.range]);
    this.drawSlider();
    this.switchActivePointer();
  }

  subscribeOn(callback: ViewCallback) {
    this.callbackList.push(callback);
  }

  getSliderElement(isContainer: boolean) {
    const className = isContainer ? classes.slider : classes.sliderContainer;
    const $element: JQuery = jQuery('<div></div>', {
      class: `${className} ${className}_${this.config.orientation}`,
    });
    return $element;
  }

  getPointer(position: number, index: number, value: number): Pointer {
    const pointerInstance = new Pointer(
      this.$container,
      this.config.orientation,
      position,
      index,
      this.config.withTooltip,
      value,
    );
    pointerInstance.subscribeOn(this.updateByPointer);
    return pointerInstance;
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
      connect: this.config.withConnect ? this.getConnect(pointers) : undefined,
      scale: this.config.withScale ? this.getScale(range) : undefined,
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
    this.callbackList.forEach((modelCallback) => modelCallback({
      activePointerIndex: index,
      position,
    }));
  }

  updateByScale(scaleData: ScaleData) {
    const { value } = scaleData;
    if (this.isSinglePointer) {
      this.activePointerIndex = 0;
    } else {
      const difference = this.config.values.map((currentValue) => Math.abs(value - currentValue));
      this.activePointerIndex = difference[0] < difference[1] ? 0 : 1;
    }
    const index = this.activePointerIndex;
    this.callbackList.forEach((modelCallback) => modelCallback({
      activePointerIndex: index,
      value,
    }));
  }

  updateByModel(modelData: ModelData) {
    const { index, positions, values } = modelData;
    if (this.entities.connect) {
      const start = this.isSinglePointer ? 0 : positions[0];
      const end = typeof positions[1] === 'number'
        ? positions[1]
        : positions[0];
      this.entities.connect.setPosition(start, end, this.isSinglePointer);
    }
    this.entities.pointers.forEach((pointer, i) => {
      pointer.setPositionAndUpdateTooltip(positions[i], this.config.withTooltip, values[i]);
    });
    this.activePointerIndex = index;
    this.switchActivePointer();
    this.positions = positions;
    this.config.values = values;
  }

  updateView(viewUpdateList: ViewUpdateList) {
    const {
      values, range, positions, orientation, withTooltip, withConnect, withScale,
    } = viewUpdateList;
    const isOrientationChanged = orientation !== this.config.orientation;
    const isConnectChanged = withConnect !== this.config.withConnect;
    const isTooltipChanged = withTooltip !== this.config.withTooltip;
    const isScaleChanged = withScale !== this.config.withScale;
    const isRangeChanged = JSON.stringify(range) !== JSON.stringify(this.config.range);
    const isValuesChanged = JSON.stringify(values) !== JSON.stringify(this.config.values);
    const isPositionsChanged = JSON.stringify(positions) !== JSON.stringify(this.config.positions);
    if (isOrientationChanged) {
      this.config.orientation = orientation;
      this.updateOrientation(orientation);
    }
    if (isConnectChanged) {
      this.config.withConnect = withConnect;
      this.updateConnect();
    }
    if (isTooltipChanged) {
      this.config.withTooltip = withTooltip;
      this.entities.pointers.forEach((pointer, index) => {
        pointer.updateTooltip(withTooltip, values[index]);
      });
    }
    if (isScaleChanged) {
      this.updateScale(range);
    }
    if (isRangeChanged && this.entities.scale) {
      this.entities.scale.updateScale(range, orientation);
    }

    if (isPositionsChanged) {
      this.updatePositions(positions, values);
    }
    if (isValuesChanged) {
      this.config.values = values;
    }
  }

  updateScale(range: ConfigRange) {
    if (this.config.withScale) {
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

  updatePositions(positions: PointerPosition, values: PointerValue) {
    this.isSinglePointer = values.length === 1;
    const lastPointerLength = this.entities.pointers.length;
    const newPointerLength = values.length;
    if (lastPointerLength !== newPointerLength) {
      this.updatePointerAndTooltip(newPointerLength, positions, values);
    }
    this.updateByModel({ values, positions, index: this.activePointerIndex });
  }

  updatePointerAndTooltip(PointerLength: number, positions: PointerPosition, values: PointerValue) {
    if (PointerLength === 2) {
      if (typeof values[1] === 'number' && typeof positions[1] === 'number') {
        this.entities.pointers.push(this.getPointer(positions[1], 1, values[1]));
        this.entities.pointers[1].$element.appendTo(this.$slider);
      }
    } else if (this.entities.pointers[1]) {
      this.entities.pointers[1].$element.remove();
      this.entities.pointers.pop();
    }
  }

  updateConnect() {
    if (this.config.withConnect) {
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
    this.$slider.removeClass(`${classes.slider}_${this.config.orientation}`);
    this.$sliderContainer.removeClass(`${classes.sliderContainer}_${this.config.orientation}`);
    this.config.orientation = orientation;
    this.$slider.addClass(`${classes.slider}_${this.config.orientation}`);
    this.$sliderContainer.addClass(`${classes.sliderContainer}_${this.config.orientation}`);
    this.entities.pointers.forEach((pointer) => {
      pointer.setOrientation(orientation);
    });
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

  bindContext() {
    this.updateByScale = this.updateByScale.bind(this);
    this.updateByPointer = this.updateByPointer.bind(this);
  }
}

export default View;
