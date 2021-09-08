// import SimpleRangeSlider from '../SimpleRangeSlider/Presenter/Presenter';

// describe('SimpleRangeSlider.ts', () => {
//   const $testContainer: JQuery = $(document.createElement('div'));
//   $(document.body).append($testContainer);
//   const testConfig: UserConfigList = {
//     orientation: 'vertical',
//     range: [-1000, 1000],
//     values: [-100, 500],
//     step: 5,
//   };

//   const testInstance: SimpleRangeSlider = new SimpleRangeSlider($testContainer, testConfig);

//   test('create class', () => {
//     expect(testInstance instanceof SimpleRangeSlider).toBe(true);
//   });

//   test('getCompleteConfig(userConfig, defaultConfig)', () => {
//     const testCompleteConfig: CompleteConfigList = <CompleteConfigList> {
//       ...testInstance.defaultConfig, ...testInstance.userConfig,
//     };
//     expect(testInstance.getCompleteConfig())
//       .toEqual(testCompleteConfig);
//   });

//   test('getModelConfig(completeConfig)', () => {
//     const { values, range, step } = testInstance.completeConfig;
//     const testModelConfig: ModelConfigList = <ModelConfigList> {
//       values, range, step,
//     };
//     expect(testInstance.getModelConfig())
//       .toEqual(testModelConfig);
//   });

//   test('getViewConfig(completeConfig)', () => {
//     const testViewConfig: ViewConfigList = { ...testInstance.completeConfig };
//     expect(testInstance.getViewConfig())
//       .toEqual(testViewConfig);
//   });
// });
