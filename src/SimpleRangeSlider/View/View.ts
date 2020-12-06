import Connect from './entities/Connect';
import Pointer from './entities/Pointer';

class View {
  readonly normalizingCoefficient: number = 1e4;

  $container: JQuery;

  config: iConfigView;

  $slider: JQuery;

  pointer: Pointer[];

  connect: Connect;

  constructor($container: JQuery, config: iConfigView) {
    this.$container = $container;
    this.config = config;
    this.$slider = this.getSlider();
    this.pointer = this.config.start.map((value, index) => this.getPointer(value, index));
    this.connect = this.getConnect(this.pointer);
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

  getConnect(pointer: Pointer[]): Connect {
    if (pointer.length === 1) {
      return new Connect(0, pointer[0].position, this.config.orientation);
    }
    return new Connect(pointer[0].position, pointer[1].position, this.config.orientation);
  }

  getNormalizedPosition(position: number):number {
    return Math.round(position * this.normalizingCoefficient);
  }

  drawSlider() {
    this.pointer.forEach((pointer) => {
      this.$slider.append(pointer.$element);
    });
    this.$slider.append(this.connect.$element);
    this.$container.append(this.$slider);
  }
}

export default View;
