import DemoPanel from './demo-panel';

jQuery(document).ready(() => {
  const $demoPanels = $('.js-demo-panel');
  $.each($demoPanels, (_, element) => {
    // eslint-disable-next-line no-new
    new DemoPanel($(element));
  });
});
