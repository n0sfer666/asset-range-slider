import DemoPanel from './demo-panel';

jQuery(document).ready(() => {
  $('.js-demo-panel').each((_, element) => {
    // eslint-disable-next-line no-new
    new DemoPanel($(element));
  });
});
