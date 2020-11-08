import Model from '../Model/Model';
import View from '../View/View';

class Presenter {
  private view: View;

  private model: Model;

  constructor(view: View, model: Model) {
    this.view = view;
    this.model = model;
    console.log('presenter initiated');
  }
}

export default Presenter;
