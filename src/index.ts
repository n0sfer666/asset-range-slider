import './style/main.scss';
import './style/demoPanel.scss';
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
