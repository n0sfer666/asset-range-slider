import Pointer from '../../../SimpleRangeSlider/View/entities/Pointer';
import makeRandomNumber from '../../makeRandomNumber';

describe('Pointer.ts', () => {
  const className = 'simple-range-slider__pointer';
  const normalizingCoefficient: number = 1e4;
  const $document = $(document);
  let testPointerData: tPointerData = {
    index: -1,
    position: -1,
  };
  const orientations: tOrientation[] = ['horizontal', 'vertical', 'horizontal', 'vertical'];
  const indexes: number[] = [0, 0, 1, 1];
  const pointers: Pointer[] = orientations.map((orientation, index) => {
    const position: number = Math.round(Math.random() * normalizingCoefficient)
      / normalizingCoefficient;
    const $testContainer = $(document.createElement('div'));
    $document.find('body').append($testContainer);
    return new Pointer($testContainer, orientation, position, indexes[index]);
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
        testPointerData = pointerData;
      };

      pointer.subscribeOn(testCallback);
      const testCallbackList: iPointerCallback[] = [testCallback];

      test('subscribeOn(callback)', () => {
        expect(testCallbackList).toEqual(pointer.callbackList);
      });

      test('getShift(event)', () => {
        const testEvent: JQuery.MouseEventBase = jQuery.Event('click');
        testEvent.clientX = makeRandomNumber(-1e4, 1e4);
        testEvent.clientY = makeRandomNumber(-1e4, 1e4);
        const elementOffset = $element.offset() || $element[0].getBoundingClientRect();
        const expectShift: number = pointer.orientation === 'horizontal'
          ? testEvent.clientX - elementOffset.left
          : testEvent.clientY - elementOffset.top;
        expect(pointer.getShift(testEvent)).toEqual(expectShift);
      });

      test('All handlers are called', () => {
        const handler = jest.fn();
        pointer.$element.on('mousedown', handler);
        pointer.$element.on('mousemove', handler);
        pointer.$element.on('mouseup', handler);
        pointer.$element.mousedown();
        pointer.$element.mousemove();
        pointer.$element.mouseup();
        expect(handler).toBeCalledTimes(3);
      });

      test('handlePointerMouseDown(event)', () => {
        const { $container } = pointer;
        const testEvent: JQuery.MouseEventBase = jQuery.Event('mousedown');
        testEvent.clientX = makeRandomNumber(-1e4, 1e4);
        testEvent.clientY = makeRandomNumber(-1e4, 1e4);
        const containerOffset = $container.offset() || $container[0].getBoundingClientRect();
        const boundingClientRect = pointer.orientation === 'horizontal'
          ? containerOffset.left
          : containerOffset.top;
        const outerWidth = $container.outerWidth() || $container[0].offsetWidth;
        const outerHeight = $container.outerHeight() || $container[0].offsetHeight;
        const containerOffsetSize = pointer.orientation === 'horizontal'
          ? outerWidth
          : outerHeight;
        pointer.handlePointerMouseDown(testEvent);
        expect(boundingClientRect).toEqual(pointer.boundingClientRect);
        expect(containerOffsetSize).toEqual(pointer.containerOffsetSize);
      });

      test('handlePointerMove(event)', () => {
        const testEvent: JQuery.MouseEventBase = jQuery.Event('mousemove');
        testEvent.clientX = Math.round(Math.random() * 1e2);
        testEvent.clientY = Math.round(Math.random() * 1e2);
        const cursorPosition = pointer.orientation === 'horizontal'
          ? testEvent.clientX
          : testEvent.clientY;
        const newPosition = cursorPosition - pointer.shift - pointer.boundingClientRect;
        const newPositionInPercent = newPosition / pointer.containerOffsetSize;
        const position = pointer.getNormalizePosition(newPositionInPercent);
        const expectData: tPointerData = {
          index: pointer.index,
          position,
        };
        pointer.handlePointerMove(testEvent);
        expect(expectData).toEqual(testPointerData);
      });
    });
  });
});
