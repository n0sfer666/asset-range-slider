import Presenter from '../../SimpleRangeSlider/Presenter/Presenter';

describe('Presenter', () => {
  const $container = $('<div></div>').appendTo(document.body);
  const instance: Presenter = new Presenter($container, {});

  test('update slider', () => {
    const config = JSON.parse(JSON.stringify(instance.getConfig()));
    instance.updateSlider({
      range: [-1000, 1000],
    });
    expect(config).not.toEqual(instance.getConfig());
  });
});
