import Tooltip from '../Tooltip';

class InputCheckboxTooltip {
  $element: JQuery;

  tooltips: Tooltip[];

  constructor($element: JQuery, tooltips: Tooltip[]) {
    this.$element = $element;
    this.tooltips = tooltips;
    this.$element.prop('checked', true);
    this.bindContext();
    this.unbindHandler();
    this.bindHandlers();
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
