describe('Scale', () => {
  test.todo('please pass');
});
// import Scale from '../../../SimpleRangeSlider/View/entities/Scale';
// import makeRandomNumber from '../../makeRandomNumber';

// describe('Scale.ts', () => {
//   const range: ConfigRange = [
//     makeRandomNumber(-1e5, 0),
//     makeRandomNumber(1, 1e5),
//   ];
//   const orientations: ConfigOrientation[] = ['horizontal', 'vertical'];
//   const testInstances: Scale[] = orientations.map(
//     (orientation) => new Scale(range, orientation),
//   );
//   const [{ valuePipsNumber, emptyPipsNumber }] = testInstances;
//   let tesScaleData: ScaleData = {
//     position: -1e8,
//   };
//   const testCallback: ScaleCallback = (scaleData: ScaleData) => {
//     tesScaleData = scaleData;
//   };
//   const className = 'simple-range-slider';

//   test('getElement(elementName, modifier?)', () => {
//     const elementName = 'test';
//     const modifierName = 'test';

//     const $expectElement = $(document.createElement('div'));
//     $expectElement.addClass(`${className}__${elementName}`);
//     const $expectElementWithModifier = $(document.createElement('div'));
//     $expectElementWithModifier.addClass(`${className}__${elementName}`)
//       .addClass(`${className}__${elementName}_${modifierName}`);

//     expect($expectElement).toEqual(Scale.getElement(elementName));
//     expect($expectElementWithModifier)
//       .toEqual(Scale.getElement(elementName, modifierName));
//   });

//   test('getValues()', () => {
//     const expectResult: number[] = [range[0]];
//     const diapason = range[1] - range[0];
//     const difference = Math.round(diapason / (valuePipsNumber - 1));
//     for (let i = 0; expectResult.length < (valuePipsNumber - 1); i += 1) {
//       expectResult.push(expectResult[i] + difference);
//     }
//     expectResult.push(range[1]);
//     testInstances.forEach((instance) => {
//       expect(expectResult).toEqual(instance.getValues());
//     });
//   });

//   test('getEmptyPips()', () => {
//     const $expectEmptyPips: JQuery[] = [];
//     for (let i = 0; i < emptyPipsNumber; i += 1) {
//       const $emptyDash = Scale.getElement('scale-pip-dash', 'empty');
//       $expectEmptyPips.push(Scale.getElement('scale-pip').append($emptyDash));
//     }
//     testInstances.forEach((instance) => {
//       expect($expectEmptyPips).toEqual(instance.getEmptyPips());
//     });
//   });

//   test('getValuePips()', () => {
//     testInstances.forEach((instance) => {
//       const $expectValuePips: JQuery[] = instance.values.map((value) => {
//         const $dash = Scale.getElement('scale-pip-dash');
//         const $pipValue = Scale.getElement('scale-pip-value').text(value);
//         if (instance.orientation === 'vertical') {
//           return Scale.getElement('scale-pip').append($pipValue, $dash);
//         }
//         return Scale.getElement('scale-pip').append($dash, $pipValue);
//       });
//       expect($expectValuePips).toEqual(instance.getValuePips());
//     });
//   });

//   test('getPositions()', () => {
//     const expectPositions: number[] = [0];
//     const difference = 1 / (valuePipsNumber - 1);
//     for (let i = 0; expectPositions.length < (valuePipsNumber - 1); i += 1) {
//       expectPositions.push(expectPositions[i] + difference);
//     }
//     expectPositions.push(1);
//     testInstances.forEach((instance) => {
//       expect(expectPositions).toEqual(instance.getPositions());
//     });
//   });

//   test('subscribeOn(callback)', () => {
//     testInstances.forEach((instance) => {
//       instance.subscribeOn(testCallback);
//       const index = instance.callbackList.length - 1;
//       expect(testCallback).toEqual(instance.callbackList[index]);
//     });
//   });

//   test('handlerValuePipClick(event)', () => {
//     testInstances.forEach((instance) => {
//       const { $valuePips, positions } = instance;
//       $valuePips.forEach(($pip, index) => {
//         $pip.click();
//         expect(positions[index]).toBe(tesScaleData.position);
//       });
//     });
//   });
// });
