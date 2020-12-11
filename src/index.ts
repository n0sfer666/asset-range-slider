import './style/main.css';
import DemoPanel from './DemoPanel/DemoPanel';

class Main {
  constructor() {
    jQuery(document).ready(() => {
      const container: JQuery = $('.js-plugin');
      const input: tConfigInput = {
        $value: [$('.js-input-value-1'), $('.js-input-value-2')],
        $tooltip: $('.js-input-tooltip'),
      };
      const config: iConfigUser = {
        orientation: 'horizontal',
        range: [-100, 100],
        start: [-10, 10],
        step: 1,
        input,
      };
      const demoPanel = new DemoPanel(container, config);
    });
  }
}

const main: Main = new Main();
