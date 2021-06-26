import Presenter from './Controller/Presenter';
import Model from './Model/Model';
import View from './View/View';

class SimpleRangeSlider {
  $container: JQuery;

  userConfig: iConfigUser;

  completeConfig: iCompleteConfig;

  view: View;

  model: Model;

  presenter: Presenter;

  constructor($container: JQuery, config: iConfigUser) {
    this.$container = $container;
    this.userConfig = config;
    const defaultConfig: iCompleteConfig = SimpleRangeSlider.getDefaultConfig();
    this.completeConfig = this.getCompleteConfig(defaultConfig);
    this.model = new Model(this.getModelConfig());
    const positions: number[] = this.completeConfig.start.map(
      (value) => this.model.getPositionFromValue(value),
    );
    this.view = new View(this.$container, this.getViewConfig(), positions);
    this.presenter = new Presenter(this.view, this.model);
  }

  static getDefaultConfig(): iCompleteConfig {
    return {
      orientation: 'horizontal',
      start: [10],
      range: [0, 100],
      step: 1,
      connect: true,
      tooltip: true,
      scale: true,
    };
  }

  getCompleteConfig(defaultConfig: iCompleteConfig): iCompleteConfig {
    return <iCompleteConfig> { ...(this.userConfig || defaultConfig) };
  }

  getModelConfig(): iConfigModel {
    return {
      start: this.completeConfig.start,
      range: this.completeConfig.range,
      step: this.completeConfig.step,
    };
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
