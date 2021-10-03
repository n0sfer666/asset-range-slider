import Presenter from '../../SimpleRangeSlider/Presenter/Presenter';

describe('Presenter', () => {
  const $container = $('<div></div>').appendTo(document.body);
  const instance: Presenter = new Presenter($container, {});

  test('updateSlider', () => {
    const config = JSON.parse(JSON.stringify(instance.getConfig()));
    instance.updateSlider({
      range: [-1000, 1000],
    });
    expect(config).not.toEqual(instance.getConfig());
  });

  test('getConfig()', () => {
    const testConfig: CompleteConfigList = {
      orientation: 'vertical',
      values: [-50, 50],
      range: [-100, 100],
      step: 1,
      withConnect: true,
      withScale: true,
      withTooltip: true,
    };
    instance.updateSlider({
      orientation: 'vertical',
      values: [-50, 50],
      range: [-100, 100],
      step: 1,
      withConnect: true,
      withScale: true,
      withTooltip: true,
    });
    expect(testConfig).toEqual(instance.getConfig());
  });
});
