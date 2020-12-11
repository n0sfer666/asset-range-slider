class InputTextValue {
  $element: JQuery;

  value: number;

  index: number;

  constructor($element: JQuery, value: number, index: number) {
    this.$element = $element;
    this.value = value;
    this.index = index;
    this.setNewValue(this.value);
  }

  setNewValue(value: number) {
    this.$element.val(value);
    this.value = value;
  }
}

export default InputTextValue;
