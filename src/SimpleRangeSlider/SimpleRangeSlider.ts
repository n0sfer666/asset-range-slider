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
    const defaultConfig: iCompleteConfig = this.getDefaultConfig();
    const completeConfig: iCompleteConfig = this.getCompleteConfig(this.config, defaultConfig);
    const modelConfig: iConfigModel = this.getModelConfig(completeConfig);
    const viewConfig: iConfigView = this.getViewConfig(completeConfig);
    this.model = new Model(modelConfig);
    const position: number[] = completeConfig.start.map(
      (value) => this.model.getPositionFromValue(value),
    );
    this.view = new View(this.$container, viewConfig, position);
    this.presenter = new Presenter(this.view, this.model);
  }

  getDefaultConfig(): iCompleteConfig {
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

  getCompleteConfig(userConfig: iConfigUser, defaultConfig: iCompleteConfig): iCompleteConfig {
    return {
      orientation: userConfig.orientation === undefined
        ? defaultConfig.orientation
        : userConfig.orientation,
      start: userConfig.start === undefined
        ? defaultConfig.start
        : userConfig.start,
      range: userConfig.range === undefined
        ? defaultConfig.range
        : userConfig.range,
      step: userConfig.step === undefined
        ? defaultConfig.step
        : userConfig.step,
      connect: userConfig.connect === undefined
        ? defaultConfig.connect
        : userConfig.connect,
      tooltip: userConfig.tooltip === undefined || userConfig.input?.$tooltip !== undefined
        ? defaultConfig.tooltip
        : userConfig.tooltip,
      scale: userConfig.scale === undefined
        ? defaultConfig.scale
        : userConfig.scale,
      input: userConfig.input,
    };
  }

  getModelConfig(completeConfig: iCompleteConfig): iConfigModel {
    return {
      start: completeConfig.start,
      range: completeConfig.range,
      step: completeConfig.step,
    };
  }

  getViewConfig(completeConfig: iCompleteConfig): iConfigView {
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

(function ($: JQueryStatic) {
  $.fn.extend({
    SimpleRangeSlider(config: iConfigUser) {
      return new SimpleRangeSlider(<JQuery> this, <iConfigUser> config);
    },
  });
}(jQuery));
