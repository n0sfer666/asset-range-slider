import Tooltip from '../Tooltip';

class InputCheckboxTooltip {
  $element: JQuery;

  tooltips: Tooltip[];

  constructor($element: JQuery, tooltips: Tooltip[]) {
    this.bindContext();
    this.$element = $element;
    this.tooltips = tooltips;
    this.$element.prop('checked', true);
    this.unbindHandler();
    this.bindHandlers();
  }

  switchChecked(isVisible: boolean) {
    if (isVisible) {
      this.$element.prop('checked', true);
    } else {
      this.$element.prop('checked', false);
    }
  }

  handleTooltipCheckboxChange() {
    const isVisible: boolean = this.$element.is(':checked');
    this.tooltips.forEach((tooltip) => tooltip.switchHidden(isVisible));
  }

  bindContext() {
    this.handleTooltipCheckboxChange = this.handleTooltipCheckboxChange.bind(this);
  }

  bindHandlers() {
    this.$element.on('change', this.handleTooltipCheckboxChange);
  }

  unbindHandler() {
    this.$element.off('change');
  }
}

export default InputCheckboxTooltip;
