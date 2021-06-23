import DemoPanel from './demo-panel';

jQuery(document).ready(() => {
  const demoPanel: DemoPanel[] = [];
  const $demoPanels = $('.js-demo-panel');
  $.each($demoPanels, (_, element) => {
    demoPanel.push(new DemoPanel($(element)));
  });
});
