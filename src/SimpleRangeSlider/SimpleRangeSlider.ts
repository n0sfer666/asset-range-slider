import Presenter from './Controller/Presenter';
import Model from './Model/Model';
import View from './View/View';

class SimpleRangeSlider {
  $container: JQuery;

  userConfig: iConfigUser;

  readonly defaultConfig: iCompleteConfig = {
    orientation: 'horizontal',
    start: [10],
    range: [0, 100],
    step: 1,
    connect: true,
    tooltip: true,
    scale: true,
  }

  completeConfig: iCompleteConfig;

  view: View;

  model: Model;

  presenter: Presenter;

  constructor($container: JQuery, config: iConfigUser) {
    this.$container = $container;
    this.userConfig = config;
    this.completeConfig = this.getCompleteConfig();
    this.model = new Model(this.getModelConfig());
    const positions: number[] = this.completeConfig.start.map(
      (value) => this.model.getPositionFromValue(value),
    );
    this.view = new View(this.$container, this.getViewConfig(), positions);
    this.presenter = new Presenter(this.view, this.model);
  }

  getCompleteConfig(): iCompleteConfig {
    return <iCompleteConfig> { ...this.defaultConfig, ...this.userConfig };
  }

  getModelConfig(): iConfigModel {
    const { start, range, step } = this.completeConfig;
    return { start, range, step };
  }

  getViewConfig(): iConfigView {
    return <iConfigView> { ...this.completeConfig };
  }

  rebuildSlider(config: iCompleteConfig) {
    this.$container.empty();
    this.completeConfig = config;
    this.model = new Model(this.getModelConfig());
    const positions: number[] = this.completeConfig.start.map(
      (value) => this.model.getPositionFromValue(value),
    );
    this.view = new View(this.$container, this.getViewConfig(), positions);
    this.presenter = new Presenter(this.view, this.model);
  }
}

export default SimpleRangeSlider;
