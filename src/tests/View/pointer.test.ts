import Pointer from '../../SimpleRangeSlider/View/entities/Pointer';

const className = 'simple-range-slider__pointer';
const normalizingCoefficient: number = 1e4;
const $document = $(document);
let pData: tPointerData;

describe('Pointer.ts', () => {
  const orientations: tOrientation[] = ['horizontal', 'vertical', 'horizontal', 'vertical'];
  const indexes: number[] = [0, 0, 1, 1];
  const $testContainers: JQuery[] = [
    $(document.createElement('div')),
    $(document.createElement('div')),
    $(document.createElement('div')),
    $(document.createElement('div')),
  ];
  const pointers: Pointer[] = orientations.map((orientation, index) => {
    const position: number = Math.round(Math.random() * normalizingCoefficient)
      / normalizingCoefficient;
    return new Pointer($testContainers[index], orientation, position, indexes[index]);
  });

  test('getElement()', () => {
    const $testElement: JQuery[] = orientations.map((orientation) => {
      const $element: JQuery = $(document.createElement('div'));
      $element.addClass(`${className}`);
      $element.addClass(`${className}_${orientation}`);
      return $element;
    });
    pointers.forEach(
      (pointer, index) => expect(pointer.getElement()).toEqual($testElement[index]),
    );
  });

  test('switchActive(isActive)', () => {
    pointers.forEach((pointer) => {
      pointer.switchActive(true);
      expect(pointer.$element.hasClass(`${className}_active`)).toBe(true);
      pointer.switchActive(false);
      expect(pointer.$element.hasClass(`${className}_active`)).toBe(false);
    });
  });

  test('setPosition(position)', () => {
    pointers.forEach((pointer) => {
      const position: number = Math.round(Math.random() * normalizingCoefficient)
        / normalizingCoefficient;
      const liter: string = pointer.orientation === 'horizontal' ? 'X' : 'Y';
      const expectCss: string = `translate${liter}(${position * normalizingCoefficient}%)`;
      pointer.setPosition(position);
      expect(pointer.$element.css('transform')).toEqual(expectCss);
      expect(pointer.position).toBe(position);
    });
  });

  describe('event methods', () => {
    pointers.forEach((pointer) => {
      const { $element } = pointer;
      const testCallback: iPointerCallback = (pointerData: tPointerData) => {
        pData = pointerData;
      };
      const randomValue: number = Math.round(Math.random() * 1e2);
      const testEvent: JQuery.MouseEventBase = jQuery.Event('click');
      testEvent.clientX = randomValue;
      testEvent.clientY = randomValue;
      const elementOffset = $element.offset() || $element[0].getBoundingClientRect();
      const expectShift: number = pointer.orientation === 'horizontal'
        ? testEvent.clientX - elementOffset.left
        : testEvent.clientY - elementOffset.top;

      pointer.subscribeOn(testCallback);
      const testCallbackList: iPointerCallback[] = [testCallback];

      test('subscribeOn(callback)', () => {
        expect(testCallbackList).toEqual(pointer.callbackList);
      });

      test('getShift(event)', () => {
        expect(pointer.getShift(testEvent)).toEqual(expectShift);
      });
    });
  });

  // test('getShift(event)', () => {
  //   pointers.forEach((pointer) => {
  //     const { $element } = pointer;
  //     const randomValue: number = Math.round(Math.random() * 1e2);
  //     const testEvent: JQuery.MouseEventBase = jQuery.Event('click');
  //     testEvent.clientX = randomValue;
  //     testEvent.clientY = randomValue;
  //     const elementOffset = $element.offset() || $element[0].getBoundingClientRect();
  //     const expectShift: number = pointer.orientation === 'horizontal'
  //       ? testEvent.clientX - elementOffset.left
  //       : testEvent.clientY - elementOffset.top;
  //     expect(pointer.getShift(testEvent)).toEqual(expectShift);
  //   });
  // });

  // test('handlePointerMouseDown(event)' () => {
  //   pointers.forEach((pointer) => {
  //     const { $element } = pointer;
  //     const randomValue: number = Math.round(Math.random() * 1e2);
  //     const testEvent: JQuery.MouseEventBase = jQuery.Event('click');
  //     testEvent.clientX = randomValue;
  //     testEvent.clientY = randomValue;
  //     const elementOffset = $element.offset() || $element[0].getBoundingClientRect();
  //     const expectShift: number = pointer.orientation === 'horizontal'
  //       ? testEvent.clientX - elementOffset.left
  //       : testEvent.clientY - elementOffset.top;
  //   });
  // });
});
