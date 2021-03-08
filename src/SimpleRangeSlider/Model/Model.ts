import Calculation from './entities/Calculation';
import Handler from './entities/Handler';

class Model {
  config: iConfigModel;

  calculation: Calculation;

  handler: Handler;

  callbackList: iModelCallback[] = [];

  position: number[];

  range: tRange;

  value: number[];

  step: number;

  activePointerIndex: number = 0;

  constructor(config: iConfigModel) {
    this.config = config;
    this.value = config.start;
    this.range = config.range;
    this.step = config.step;
    this.position = this.value.map((val) => this.getPositionFromValue(val));
    this.calculation = new Calculation(this.config);
    this.handler = new Handler();
  }

  subscribeOn(callback: iModelCallback) {
    this.callbackList.push(callback);
  }

  getPositionFromValue(value: number) {
    return (value - this.range[0]) / (this.range[1] - this.range[0]);
  }
}

export default Model;
