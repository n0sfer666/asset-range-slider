import Presenter from '../../SimpleRangeSlider/Controller/Presenter';
import Model from '../../SimpleRangeSlider/Model/Model';
import View from '../../SimpleRangeSlider/View/View';

describe('Presenter.ts', () => {
  const start: PointerValue = [10];
  const range: ConfigRange = [0, 100];
  const step = 1;
  const modelConfig: ModelConfigList = { start, range, step };
  const model: Model = new Model(modelConfig);

  const $container = $(document.createElement('div'));
  $(document.body).append($container);
  const viewConfig: ViewConfigList = {
    connect: true,
    scale: true,
    tooltip: true,
    orientation: 'horizontal',
    start,
    range,
    step,
  };
  const positions: number[] = start.map(
    (value) => model.getPositionFromValue(value),
  );
  const view: View = new View($container, viewConfig, positions);

  const presenter: Presenter = new Presenter(view, model);

  test('presenter instanceof Presenter', () => {
    expect(presenter instanceof Presenter).toBe(true);
  });
});
