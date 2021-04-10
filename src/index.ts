import './style/main.css';
import './style/demoPanel.css';
import DemoPanel from './DemoPanel/DemoPanel';

class Main {
  constructor() {
    jQuery(document).ready(() => {
      const demoPanelContainer: JQuery = $('.js-demo-panel');
      const demoP = new DemoPanel(demoPanelContainer);
    });
  }
}

const main: Main = new Main();
