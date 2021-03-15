import Model from '../Model/Model';
import View from '../View/View';

class Presenter {
  private view: View;

  private model: Model;

  constructor(view: View, model: Model) {
    this.view = view;
    this.model = model;
    this.view.subscribeOn((viewData: tViewData) => {
      this.model.updateByView(viewData);
    });
    this.model.subscribeOn((modelData: tModelData) => {
      this.view.updateByModel(modelData);
    });
  }
}

export default Presenter;
