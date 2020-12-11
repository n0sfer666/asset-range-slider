class Input {
  type: tInputType;

  $element: JQuery;

  value?: number;

  index?: number;

  constructor(type: tInputType, $element: JQuery, value?: number, index?: number) {
    this.type = type;
    this.$element = $element;
    this.value = value || undefined;
    this.index = index || undefined;
    if (this.type === 'tooltip' && this.value) {
      this.$element.val(this.value);
    }
  }
}

export default Input;
