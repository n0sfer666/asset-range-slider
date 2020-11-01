import "./style/main.css";
import DemoPanel from './DemoPanel/DemoPanel';

class Main {
  constructor() {
    jQuery(document).ready(() => {
      const container:JQuery = $('.js-plugin');
      const demoPanel = new DemoPanel(container);
    });
    console.log('main was initiated');
  }
}

const main: Main = new Main();