import Calculation from './entities/Calculation';
import Handler from './entities/Handler';

class Model {
  config: iConfigModel;

  calculation: Calculation;

  handler: Handler;

  constructor(config: iConfigModel) {
    this.config = config;
    this.calculation = new Calculation(this.config);
    this.handler = new Handler();
  }
}

export default Model;
