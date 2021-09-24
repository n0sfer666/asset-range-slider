import Model from '../Model/Model';
import View from '../View/View';

class Presenter {
  private view: View;

  private model: Model;

  constructor($container: JQuery, config: UserConfigList) {
    this.model = new Model(config);
    this.view = new View($container, this.model.getConfig(), this.model.getPosition());
    this.view.subscribeOn((viewData) => {
      this.model.updateByView(viewData);
    });
    this.model.subscribeOn((modelData) => {
      this.view.updateByModel(modelData);
    });
  }

  getConfig(): CompleteConfigList {
    return { ...this.model.getConfig() };
  }

  updateSlider(config: UserConfigList) {
    this.view.updateView(this.model.getViewUpdateList(config));
  }
}

export default Presenter;
