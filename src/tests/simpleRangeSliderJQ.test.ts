import '../SimpleRangeSlider/SimpleRangeSliderJQ';

test('simpleRangeSliderJQ.ts', () => {
  const $container = $(document.createElement('div')).addClass('js-slider');
  $(document.body).append($container);
  const $slider = $container.simpleRangeSlider({});
  expect($slider.length).toBeGreaterThan(0);
});
