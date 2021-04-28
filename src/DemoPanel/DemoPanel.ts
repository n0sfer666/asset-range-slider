import Panel from './entities/Panel';

class DemoPanel {
  $container: JQuery;

  config: iCompleteConfig;

  panel: Panel;

  constructor($container: JQuery) {
    this.$container = $container;
    this.config = this.getDefaultConfig();
    this.panel = new Panel(this.config);
    this.setPanel();
  }

  getDefaultConfig(): iCompleteConfig {
    return {
      orientation: 'horizontal',
      start: [10],
      range: [0, 100],
      step: 10,
      connect: true,
      tooltip: true,
      scale: true,
    };
  }

  setPanel() {
    this.$container.append(this.panel.mainContainers.$main);
  }
}

export default DemoPanel;

(function ($: JQueryStatic) {
  $.fn.extend({
    DemoP() {
      return new DemoPanel(<JQuery> this);
    },
  });
}(jQuery));
