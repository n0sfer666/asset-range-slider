// import Presenter from '../../SimpleRangeSlider/Presenter/Presenter';
// import Model from '../../SimpleRangeSlider/Model/Model';
// import View from '../../SimpleRangeSlider/View/View';

// describe('Presenter.ts', () => {
//   const values: PointerValue = [10];
//   const range: ConfigRange = [0, 100];
//   const step = 1;
//   const modelConfig: ModelConfigList = { values, range, step };
//   const model: Model = new Model(modelConfig);

//   const $container = $(document.createElement('div'));
//   $(document.body).append($container);
//   const viewConfig: ViewConfigList = {
//     connect: true,
//     scale: true,
//     tooltip: true,
//     orientation: 'horizontal',
//     values,
//     range,
//     step,
//   };
//   const positions: number[] = values.map(
//     (value) => model.getPositionFromValue(value),
//   );
//   const view: View = new View($container, viewConfig, positions);

//   const presenter: Presenter = new Presenter(view, model);

//   test('presenter instanceof Presenter', () => {
//     expect(presenter instanceof Presenter).toBe(true);
//   });
// });
