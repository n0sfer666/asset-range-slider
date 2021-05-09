import Presenter from './Controller/Presenter';
import Model from './Model/Model';
import View from './View/View';

class SimpleRangeSlider {
  $container: JQuery;

  config: iConfigUser;

  view: View;

  model: Model;

  presenter: Presenter;

  constructor($container: JQuery, config: iConfigUser) {
    this.$container = $container;
    this.config = config;
    const defaultConfig: iCompleteConfig = SimpleRangeSlider.getDefaultConfig();
    const completeConfig: iCompleteConfig = SimpleRangeSlider.getCompleteConfig(
      this.config,
      defaultConfig,
    );
    const modelConfig: iConfigModel = SimpleRangeSlider.getModelConfig(completeConfig);
    const viewConfig: iConfigView = SimpleRangeSlider.getViewConfig(completeConfig);
    this.model = new Model(modelConfig);
    const positions: number[] = completeConfig.start.map(
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
      connect: userConfig.connect || defaultConfig.connect,
      tooltip: userConfig.tooltip || defaultConfig.tooltip,
      scale: userConfig.scale || defaultConfig.scale,
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
}

export default SimpleRangeSlider;
