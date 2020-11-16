import './style/main.css';
import DemoPanel from './DemoPanel/DemoPanel';

class Main {
  constructor() {
    jQuery(document).ready(() => {
      const container: JQuery = $('.js-plugin');
      const config: iConfigUser = {
        orientation: 'horizontal',
        range: [-100, 100],
        start: [-10, 10],
        step: 1,
        connect: true,
        tooltip: true,
        scale: true,
      };
      const demoPanel = new DemoPanel(container, config);
      console.log('main was initiated');
    });
  }
}

const main: Main = new Main();
