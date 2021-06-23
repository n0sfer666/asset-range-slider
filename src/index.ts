import DemoPanel from './components/demo-panel/demo-panel';

function importAll(r: any) {
  r.keys().forEach(r);
}
importAll(require.context('./style', true, /\.scss/));
importAll(require.context('./components', true, /\.scss/));
jQuery(document).ready(() => {
  const demoPanel: DemoPanel[] = [];
  const $demoPanels = $('.js-demo-panel');
  $.each($demoPanels, (_, element) => {
    demoPanel.push(new DemoPanel($(element)));
  });
});
