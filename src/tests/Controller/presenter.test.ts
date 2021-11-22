/* eslint-disable @typescript-eslint/dot-notation */
import Presenter from '../../SimpleRangeSlider/Presenter/Presenter';

describe('Presenter', () => {
  let $container = $('<div></div>').appendTo(document.body);
  let instance: Presenter = new Presenter($container, {});
  beforeEach(() => {
    $container = $('<div></div>').appendTo(document.body);
    instance = new Presenter($container, {});
  });
  afterEach(() => {
    $container.remove();
  });

  describe('view subscribe on model end vice versa', () => {
    let spies = {
      view: jest.spyOn(instance['view'], 'subscribeOn'),
      model: jest.spyOn(instance['model'], 'subscribeOn'),
    };
    const callbacks = {
      forView: (viewData: ViewData) => { instance['model'].updateByView(viewData); },
      forModel: (modelData: ModelData) => { instance['view'].updateByModel(modelData); },
    };

    beforeEach(() => {
      spies = {
        view: jest.spyOn(instance['view'], 'subscribeOn'),
        model: jest.spyOn(instance['model'], 'subscribeOn'),
      };
    });
    afterEach(() => {
      $.each(spies, (_, spy) => {
        spy.mockReset().mockRestore();
      });
    });

    test('callback for model was added', () => {
      setTimeout(() => {
        expect(spies.model).toHaveBeenCalledWith(callbacks.forModel);
      }, 5);
    });
    test('callback for view was added', () => {
      setTimeout(() => {
        expect(spies.view).toHaveBeenCalledWith(callbacks.forView);
      }, 5);
    });
  });

  describe('updateSlider', () => {
    const config = JSON.parse(JSON.stringify(instance.getConfig()));
    instance.updateSlider({
      range: [-1000, 1000],
    });
    test('config was change', () => {
      setTimeout(() => {
        expect(config).not.toEqual(instance.getConfig());
      }, 5);
    });
    test('config.range is [-1000, 1000]', () => {
      setTimeout(() => {
        expect(instance.getConfig().range).toEqual([-1000, 1000]);
      }, 5);
    });
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
