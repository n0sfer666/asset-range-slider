import Presenter from './Controller/Presenter';
import Model from './Model/Model';
import View from './View/View';

class SimpleRangeSlider {
  $container: JQuery;

  config: iConfigUser;

  completeConfig: iCompleteConfig;

  view: View;

  model: Model;

  presenter: Presenter;

  constructor($container: JQuery, config: iConfigUser) {
    this.$container = $container;
    this.config = config;
    const defaultConfig: iCompleteConfig = SimpleRangeSlider.getDefaultConfig();
    this.completeConfig = SimpleRangeSlider.getCompleteConfig(
      this.config,
      defaultConfig,
    );
    const modelConfig: iConfigModel = SimpleRangeSlider.getModelConfig(this.completeConfig);
    const viewConfig: iConfigView = SimpleRangeSlider.getViewConfig(this.completeConfig);
    this.model = new Model(modelConfig);
    const positions: number[] = this.completeConfig.start.map(
      (value) => this.model.getPositionFromValue(value),
    );
    this.view = new View(this.$container, viewConfig, positions);
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

  static getCompleteConfig(
    userConfig: iConfigUser,
    defaultConfig: iCompleteConfig,
  ): iCompleteConfig {
    return {
      orientation: userConfig.orientation || defaultConfig.orientation,
      start: userConfig.start || defaultConfig.start,
      range: userConfig.range || defaultConfig.range,
      step: userConfig.step || defaultConfig.step,
      connect: userConfig.connect === undefined ? defaultConfig.connect : userConfig.connect,
      tooltip: userConfig.tooltip === undefined ? defaultConfig.tooltip : userConfig.tooltip,
      scale: userConfig.scale === undefined ? defaultConfig.scale : userConfig.scale,
      input: userConfig.input,
    };
  }

  static getModelConfig(completeConfig: iCompleteConfig): iConfigModel {
    return {
      start: completeConfig.start,
      range: completeConfig.range,
      step: completeConfig.step,
    };
  }

  static getViewConfig(completeConfig: iCompleteConfig): iConfigView {
    return {
      orientation: completeConfig.orientation,
      start: completeConfig.start,
      range: completeConfig.range,
      tooltip: completeConfig.tooltip,
      connect: completeConfig.connect,
      scale: completeConfig.scale,
      input: completeConfig.input,
    };
  }

  rebuildSlider(config: iCompleteConfig) {
    this.$container.empty();
    this.completeConfig = config;
    const modelConfig: iConfigModel = SimpleRangeSlider.getModelConfig(this.completeConfig);
    const viewConfig: iConfigView = SimpleRangeSlider.getViewConfig(this.completeConfig);
    this.model = new Model(modelConfig);
    const positions: number[] = this.completeConfig.start.map(
      (value) => this.model.getPositionFromValue(value),
    );
    this.view = new View(this.$container, viewConfig, positions);
    this.presenter = new Presenter(this.view, this.model);
  }
}

export default SimpleRangeSlider;
