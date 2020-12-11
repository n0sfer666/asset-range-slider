import Tooltip from './Tooltip';

class Input {
  type: tInputType;

  $element: JQuery;

  value?: number;

  index?: number;

  constructor(type: tInputType, $element: JQuery, value?: number, index?: number) {
    this.type = type;
    this.$element = $element;
    this.value = value !== undefined ? value : undefined;
    this.index = index !== undefined ? index : undefined;
    if (this.value) {
      this.setNewValue(this.value);
    }
  }

  setNewValue(value: number) {
    if (this.type === 'value') {
      this.$element.val(value);
    }
  }

  setVisibilityTooltip(tooltips: Tooltip[]) {
    if (this.type === 'tooltip') {
      if (this.$element.is(':checked')) {
        tooltips.forEach((tooltip) => tooltip.$element.show());
      } else {
        tooltips.forEach((tooltip) => tooltip.$element.hide());
      }
    }
  }
}

export default Input;
