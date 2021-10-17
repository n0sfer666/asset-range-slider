import Pointer from '../../../SimpleRangeSlider/View/entities/Pointer';
import Tooltip from '../../../SimpleRangeSlider/View/entities/Tooltip';
import makeRandomNumber from '../../makeRandomNumber';

describe('Pointer', () => {
  const classes = {
    root: 'simple-range-slider__pointer',
    active: 'simple-range-slider__pointer_active',
  };
  const normalizingCoefficient: number = 1e4;
  const orientations: ConfigOrientation[] = ['horizontal', 'vertical'];
  const withTooltips: boolean[] = [true, false];
  const indexes = [0, 1];
  const testPosition = makeRandomNumber(0, 100) / 100;
  const testValue = makeRandomNumber(-100, 100);
  const pointers: Pointer[] = [];
  orientations.forEach((orientation) => {
    withTooltips.forEach((withTooltip) => {
      indexes.forEach((index) => {
        const isHorizontal = orientation === 'horizontal';
        const size = `${isHorizontal ? 'width' : 'height'}: 300px; ${isHorizontal ? 'height' : 'width'}: 6px;`;
        pointers.push(new Pointer(
          $('<div></div>', {
            style: `margin: 20px; ${size}`,
          }).appendTo($(document.body)),
          orientation,
          testPosition,
          index,
          withTooltip,
          testValue,
        ));
      });
    });
  });
  pointers.forEach((pointer) => {
    pointer.$element.css({
      width: '16px',
      height: '16px',
    });
  });
  let testPointerData: PointerData = {
    position: NaN,
    index: NaN,
  };

  test('initElement()', () => {
    pointers.forEach((pointer) => {
      expect(pointer.$element.prop('tagName')).toBe('DIV');
      expect(pointer.$element.hasClass(`${classes.root}`)).toBe(true);
      expect(pointer.$element.hasClass(`${classes.root}_${pointer.orientation}`)).toBe(true);
    });
  });

  test('initTooltip()', () => {
    pointers.forEach((pointer) => {
      if (pointer.withTooltip) {
        expect(pointer.tooltip instanceof Tooltip).toBe(true);
        expect(pointer.tooltip?.$element.parent()).toEqual(pointer.$element);
      } else {
        expect(pointer.tooltip).toBe(undefined);
      }
    });
  });

  test('updateTooltip(withTooltip, value)', () => {
    pointers.forEach((pointer) => {
      const testWithTooltip = !!makeRandomNumber(0, 1);
      const expectValue = makeRandomNumber(-100, 100);
      pointer.updateTooltip(testWithTooltip, expectValue);
      if (testWithTooltip) {
        expect(pointer.tooltip instanceof Tooltip).toBe(true);
        expect(pointer.tooltip?.value).toBe(expectValue);
        expect(pointer.tooltip?.$element.parent()).toEqual(pointer.$element);
      } else {
        expect(pointer.tooltip?.$element.parent()).not.toEqual(pointer.$element);
        if (pointer.tooltip !== undefined) {
          expect(pointer.tooltip).toBe(null);
        }
      }
    });
  });

  test('setPosition(position)', () => {
    pointers.forEach((pointer) => {
      const expectPosition = makeRandomNumber(0, 100) / 100;
      pointer.setPosition(expectPosition);
      const liter = pointer.orientation === 'horizontal' ? 'X' : 'Y';
      const pos = expectPosition * normalizingCoefficient;
      expect(`translate${liter}(${pos}%)`).toBe(pointer.$element.css('transform'));
    });
  });

  test('setPositionAndUpdateTooltip(position, withTooltip, value)', () => {
    pointers.forEach((pointer) => {
      const expectPosition = makeRandomNumber(0, 100) / 100;
      const testWithTooltip = !!makeRandomNumber(0, 1);
      const expectValue = makeRandomNumber(-100, 100);
      const spyOnSetPosition = jest.spyOn(pointer, 'setPosition');
      const spyOnUpdateTooltip = jest.spyOn(pointer, 'updateTooltip');
      pointer.setPositionAndUpdateTooltip(expectPosition, testWithTooltip, expectValue);
      expect(spyOnSetPosition).toBeCalled();
      expect(spyOnUpdateTooltip).toBeCalled();
    });
  });

  test('switchActive(isActive)', () => {
    pointers.forEach((pointer) => {
      const isActive = !!makeRandomNumber(0, 1);
      pointer.switchActive(isActive);
      if (isActive) {
        expect(pointer.$element.hasClass(classes.active)).toBe(true);
      } else {
        expect(pointer.$element.hasClass(classes.active)).toBe(false);
      }
    });
  });

  test('subscribeOn(callback)', () => {
    const testCallback: PointerCallback = (pointerData: PointerData) => {
      testPointerData = pointerData;
    };
    pointers.forEach((pointer) => {
      pointer.subscribeOn(testCallback);
      expect(pointer.callbackList[0]).toEqual(testCallback);
    });
  });

  test('getShift(event)', () => {
    pointers.forEach((pointer) => {
      const testOffset = makeRandomNumber(1, 50);
      const testClient = makeRandomNumber(51, 100);
      const isHorizontal = pointer.orientation === 'horizontal';
      const offsetSpy = jest.spyOn(pointer.$element, 'offset').mockReturnValue({
        left: isHorizontal ? testOffset : 0,
        top: isHorizontal ? 0 : testOffset,
      });
      const expectShift = testClient - testOffset;
      const fakeEvent: JQuery.MouseEventBase = new jQuery.Event('click');
      fakeEvent.clientX = isHorizontal ? testClient : 0;
      fakeEvent.clientY = isHorizontal ? 0 : testClient;
      expect(expectShift).toBe(pointer.getShift(fakeEvent));
      offsetSpy.mockReset().mockRestore();
      jest.resetAllMocks();
    });
  });

  test('getNormalizePosition(position)', () => {
    const position = makeRandomNumber(0, 100) / 100;
    const expectResult = Math.round(position * normalizingCoefficient) / normalizingCoefficient;
    expect(expectResult).toBe(pointers[0].getNormalizePosition(position));
  });

  test('setOrientation(orientation)', () => {
    pointers.forEach((pointer) => {
      const lastOrientation = pointer.orientation;
      const newOrientation: ConfigOrientation = lastOrientation === 'horizontal'
        ? 'vertical'
        : 'horizontal';
      const spyTooltipSetOrientation = pointer.tooltip
        ? jest.spyOn(pointer.tooltip, 'setOrientation')
        : jest.fn(() => {});
      pointer.setOrientation(newOrientation);
      expect(pointer.orientation).toBe(newOrientation);
      expect(pointer.$element.hasClass(`${classes.root}_${newOrientation}`)).toBe(true);
      if (pointer.withTooltip) {
        expect(spyTooltipSetOrientation).toBeCalled();
      }
      const spySetPosition = jest.spyOn(pointer.$element, 'removeClass');
      pointer.setOrientation(newOrientation);
      expect(spySetPosition).not.toBeCalled();
      spySetPosition.mockReset().mockRestore();
      spyTooltipSetOrientation.mockReset().mockRestore();
      jest.resetAllMocks();
      pointer.setOrientation(lastOrientation);
    });
  });

  test('handlePointerMouseDown(event)', () => {
    pointers.forEach((pointer) => {
      const testOffset = makeRandomNumber(1, 50);
      const testClient = makeRandomNumber(51, 100);
      const testOffsetContainer = makeRandomNumber(101, 150);
      const isHorizontal = pointer.orientation === 'horizontal';
      const fakeEvent: JQuery.MouseEventBase = new jQuery.Event('mousedown');
      fakeEvent.clientX = isHorizontal ? testClient : 0;
      fakeEvent.clientY = isHorizontal ? 0 : testClient;
      const spyOffset = jest.spyOn(pointer.$element, 'offset').mockReturnValue({
        left: isHorizontal ? testOffset : 0,
        top: isHorizontal ? 0 : testOffset,
      });
      const spyOffsetContainer = jest.spyOn(pointer.$container, 'offset').mockReturnValue({
        left: isHorizontal ? testOffsetContainer : 0,
        top: isHorizontal ? 0 : testOffsetContainer,
      });
      const spyOn = jest.spyOn(jQuery.fn, 'on');
      const expectContainerOffsetSize = pointer.orientation === 'horizontal'
        ? pointer.$container.outerWidth()
        : pointer.$container.outerHeight();
      pointer.handlePointerMouseDown(fakeEvent);
      expect(pointer.shift).toBe(pointer.getShift(fakeEvent));
      expect(pointer.boundingClientRect).toBe(testOffsetContainer);
      expect(pointer.containerOffsetSize).toBe(expectContainerOffsetSize);
      expect(spyOn).toHaveBeenNthCalledWith(1, 'mousemove', pointer.handlePointerMove);
      expect(spyOn).toHaveBeenNthCalledWith(2, 'mouseup', pointer.handlePointerMouseUp);
      spyOn.mockReset().mockRestore();
      spyOffset.mockReset().mockRestore();
      spyOffsetContainer.mockReset().mockRestore();
    });
  });

  test('handlePointerMove(event)', () => {
    pointers.forEach((pointer) => {
      const testClient = makeRandomNumber(0, 150);
      const isHorizontal = pointer.orientation === 'horizontal';
      const fakeEvent: JQuery.MouseEventBase = new jQuery.Event('mousemove');
      fakeEvent.clientX = isHorizontal ? testClient : 0;
      fakeEvent.clientY = isHorizontal ? 0 : testClient;
      const newPosition = testClient - pointer.shift - pointer.boundingClientRect;
      const newPositionInPercent = newPosition / pointer.containerOffsetSize;
      const expectPosition = pointer.getNormalizePosition(newPositionInPercent);
      const expectPointerData: PointerData = {
        position: expectPosition,
        index: pointer.index,
      };
      pointer.handlePointerMove(fakeEvent);
      expect(testPointerData).toEqual(expectPointerData);
    });
  });

  test('handlePointerMouseUp()', () => {
    pointers.forEach((pointer) => {
      const spyOff = jest.spyOn(jQuery.fn, 'off');
      pointer.handlePointerMouseUp();
      expect(spyOff).toHaveBeenNthCalledWith(1, 'mousemove', pointer.handlePointerMove);
      expect(spyOff).toHaveBeenNthCalledWith(2, 'mouseup', pointer.handlePointerMouseUp);
      spyOff.mockReset().mockRestore();
    });
  });
});
