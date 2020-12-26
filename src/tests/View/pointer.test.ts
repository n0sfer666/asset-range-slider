// import Pointer from '../../SimpleRangeSlider/View/entities/Pointer';

// describe('Pointer.ts', () => {
//   const orientations: tOrientation[] = ['horizontal', 'vertical'];
//   const normalizingCoefficient: number = 1e4;
//   const pointers: Pointer[] = orientations.map((orientation, index) => {
//     const position: number = Math.round(Math.random() * normalizingCoefficient);
//     return new Pointer(orientation, position, index);
//   });

//   const $testElement: JQuery[] = orientations.map((orientation) => {
//     const $element: JQuery = jQuery(document.createElement('div'));
//     $element.addClass('simple-range-slider__pointer');
//     $element.addClass(`simple-range-slider__pointer_${orientation}`);
//     return $element;
//   });

//   it('getElement()', () => {
//     pointers.forEach(
//       (pointer, index) => expect(pointer.getElement()).toEqual($testElement[index]),
//     );
//   });

//   test('setPosition(position)', () => {
//     pointers.forEach((pointer) => {
//       const position: number = Math.round(Math.random() * normalizingCoefficient);
//       const liter: string = pointer.orientation === 'horizontal' ? 'X' : 'Y';
//       const expectCss: string = `translate${liter}(${position}%)`;
//       pointer.setPosition(position);
//       expect(pointer.$element.css('transform')).toEqual(expectCss);
//       expect(pointer.position).toBe(position);
//     });
//   });

//   test('getShift(event)', () => {
//     pointers.forEach((pointer) => {
//       const randomValue: number = Math.round(Math.random() * 1e2);
//       const testEvent: MouseEvent | void = document.createEvent('MouseEvent');
//       testEvent.initMouseEvent('click', true, true, window, 0, 0, 0, randomValue, randomValue, false, false, false, false, 0, null);
//       const expectShift: number = pointer.orientation === 'horizontal'
//         ? testEvent.clientX - pointer.$element.position().left
//         : testEvent.clientY - pointer.$element.position().top;
//       expect(pointer.getShift(testEvent)).toEqual(expectShift);
//     });
//   });
// });
