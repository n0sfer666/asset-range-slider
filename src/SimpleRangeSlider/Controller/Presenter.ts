import Model from '../Model/Model';
import View from '../View/View';

class Presenter {
  $container: JQuery;

  userConfig: ConfigUserList;

  readonly defaultConfig: CompleteConfigList = {
    orientation: 'horizontal',
    start: [10],
    range: [0, 100],
    step: 1,
    connect: true,
    tooltip: true,
    scale: true,
  };

  completeConfig: CompleteConfigList;

  view: View;

  model: Model;

  constructor($container: JQuery, config: ConfigUserList) {
    this.$container = $container;
    this.userConfig = config;
    this.completeConfig = this.getCompleteConfig();
    this.model = new Model(this.getModelConfig());
    const positions: number[] = this.completeConfig.start.map(
      (value) => this.model.getPositionFromValue(value),
    );
    this.view = new View(this.$container, this.getViewConfig(), positions);
    this.view.subscribeOn((viewData) => {
      this.model.updateByView(viewData);
    });
    this.model.subscribeOn((modelData) => {
      this.view.updateByModel(modelData);
    });
  }

  getCompleteConfig(): CompleteConfigList {
    return <CompleteConfigList> { ...this.defaultConfig, ...this.userConfig };
  }

  getModelConfig(): ConfigModelList {
    const { start, range, step } = this.completeConfig;
    return { start, range, step };
  }

  getViewConfig(): ConfigViewList {
    return <ConfigViewList> { ...this.completeConfig };
  }

  rebuildSlider(config: ConfigUserList) {
    this.$container.empty();
    this.completeConfig = { ...this.completeConfig, ...config };
    const values = config.start ? undefined : [...this.model.values];
    this.$container.data('config', this.completeConfig);
    Object.keys(config).forEach((key) => {
      this.$container.attr(`data-${key}`, config[key]);
    });
    this.model = new Model(this.getModelConfig(), values);
    const positions: number[] = this.model.values.map(
      (value) => this.model.getPositionFromValue(value),
    );
    this.view = new View(this.$container, this.getViewConfig(), positions, values);
    this.view.subscribeOn((viewData) => {
      this.model.updateByView(viewData);
    });
    this.model.subscribeOn((modelData) => {
      this.view.updateByModel(modelData);
    });
  }
}

export default Presenter;
