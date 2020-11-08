class Model {
  private config: iConfigModel;

  constructor(config: iConfigModel) {
    this.config = config;
    console.log('model initialized');
  }
}

export default Model;
