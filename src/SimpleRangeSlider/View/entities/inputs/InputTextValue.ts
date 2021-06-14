class InputTextValue {
  $element: JQuery;

  value: number;

  index: number;

  callbackList: iInputTextCallback[] = [];

  constructor($element: JQuery, value: number, index: number) {
    this.$element = $element;
    this.value = value;
    this.index = index;
    this.setNewValue(this.value);
    this.bindContext();
    this.unbindHandler();
    this.bindHandler();
  }

  setNewValue(value: number) {
    this.$element.val(value);
    this.value = value;
  }

  subscribeOn(callback: iInputTextCallback) {
    this.callbackList.push(callback);
  }

  handleInputTextFocusout() {
    const value: number = Number(this.$element.val());
    const { index } = this;
    this.callbackList.forEach((callback) => callback({ value, index }));
  }

  bindContext() {
    this.handleInputTextFocusout = this.handleInputTextFocusout.bind(this);
  }

  bindHandler() {
    this.$element.on('focusout', this.handleInputTextFocusout);
  }

  unbindHandler() {
    this.$element.off('focusout');
  }
}

export default InputTextValue;
