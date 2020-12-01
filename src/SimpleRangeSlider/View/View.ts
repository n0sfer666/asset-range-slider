import Pointer from './entities/Pointer';

class View {
  readonly normalizingCoefficient: number = 1e4;

  $container: JQuery;

  config: iConfigView;

  $slider: JQuery;

  pointer: Pointer[];

  constructor($container: JQuery, config: iConfigView) {
    this.$container = $container;
    this.config = config;
    this.$slider = this.getSlider();
    this.pointer = this.config.start.map((value, index) => this.getPointer(value, index));
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
    return new Pointer(this.config.orientation, normalizedPosition, index);
  }

  getNormalizedPosition(position: number):number {
    return Math.round(position * this.normalizingCoefficient);
  }

  drawSlider() {
    this.pointer.forEach((pointer) => {
      this.$slider.append(pointer.$element);
    });
    this.$container.append(this.$slider);
  }
}

export default View;
