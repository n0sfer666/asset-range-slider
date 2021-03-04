import './style/main.css';
import DemoPanel from './DemoPanel/DemoPanel';

class Main {
  constructor() {
    jQuery(document).ready(() => {
      const containerHorizontal: JQuery = $('.js-plugin-horizontal');
      const inputHorizontal: tConfigInput = {
        $value: [$('.js-input-horizontal-value-1'), $('.js-input-horizontal-value-2')],
        $tooltip: $('.js-input-horizontal-tooltip'),
      };
      const configHorizontal: iConfigUser = {
        orientation: 'horizontal',
        range: [-100, 100],
        start: [-10, 10],
        step: 1,
        input: inputHorizontal,
      };
      const demoPanelHorizontal = new DemoPanel(containerHorizontal, configHorizontal);

      const containerVertical: JQuery = $('.js-plugin-vertical');
      const inputVertical: tConfigInput = {
        $value: [$('.js-input-vertical-value-1'), $('.js-input-vertical-value-2')],
        $tooltip: $('.js-input-vertical-tooltip'),
      };
      const configVertical: iConfigUser = {
        orientation: 'vertical',
        range: [-100, 100],
        start: [-10, 10],
        step: 1,
        input: inputVertical,
      };
      const demoPanelVertical = new DemoPanel(containerVertical, configVertical);
    });
  }
}

const main: Main = new Main();
