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

  describe('initElement()', () => {
    pointers.forEach((pointer) => {
      describe(`pointers[${pointers.indexOf(pointer)}]`, () => {
        test('tagName is DIV', () => {
          expect(pointer.$element.prop('tagName')).toBe('DIV');
        });
        test(`$element has class ${classes.root}`, () => {
          expect(pointer.$element.hasClass(`${classes.root}`)).toBe(true);
        });
        test(`$element has class ${classes.root}_${pointer.orientation}`, () => {
          expect(pointer.$element.hasClass(`${classes.root}_${pointer.orientation}`)).toBe(true);
        });
      });
    });
  });

  describe('initTooltip()', () => {
    pointers.forEach((pointer) => {
      describe(`pointers[${pointers.indexOf(pointer)}] (withTooltip: ${pointer.withTooltip})`, () => {
        if (pointer.withTooltip) {
          test('pointer.tooltip is instance of Tooltip', () => {
            expect(pointer.tooltip instanceof Tooltip).toBe(true);
          });
          test('pointer.tooltip.element is child of pointer.$element', () => {
            expect(pointer.tooltip?.$element.parent()).toEqual(pointer.$element);
          });
        } else {
          test('pointer.tooltip is undefined', () => {
            expect(pointer.tooltip).toBe(undefined);
          });
        }
      });
    });
  });

  describe('updateTooltip(withTooltip, value)', () => {
    pointers.forEach((pointer) => {
      const expectValue = makeRandomNumber(-100, 100);
      [!pointer.withTooltip, pointer.withTooltip].forEach((withTooltip) => {
        describe(`pointers[${pointers.indexOf(pointer)}], withTooltip: ${withTooltip}`, () => {
          if (withTooltip) {
            test('pointer.tooltip is instance of Tooltip', () => {
              pointer.updateTooltip(withTooltip, expectValue);
              expect(pointer.tooltip instanceof Tooltip).toBe(true);
            });
            test('pointer.tooltip.value is as expected', () => {
              pointer.updateTooltip(withTooltip, expectValue);
              expect(pointer.tooltip?.value).toBe(expectValue);
            });
            test('pointer.tooltip.$element is child of pointer.$element', () => {
              pointer.updateTooltip(withTooltip, expectValue);
              expect(pointer.tooltip?.$element.parent()).toEqual(pointer.$element);
            });
          } else {
            test('pointer.tooltip.$element is NOT child of pointer.$element', () => {
              pointer.updateTooltip(withTooltip, expectValue);
              expect(pointer.tooltip?.$element.parent()).not.toEqual(pointer.$element);
            });
            test('pointer.tooltip is null', () => {
              pointer.updateTooltip(withTooltip, expectValue);
              expect(pointer.tooltip).toBe(null);
            });
          }
        });
      });
    });
  });

  describe('setPosition(position)', () => {
    pointers.forEach((pointer) => {
      const expectPosition = makeRandomNumber(0, 100) / 100;
      const liter = pointer.orientation === 'horizontal' ? 'X' : 'Y';
      const pos = expectPosition * normalizingCoefficient;
      test(`pointers[${pointers.indexOf(pointer)}] css transform is as expected`, () => {
        pointer.setPosition(expectPosition);
        expect(`translate${liter}(${pos}%)`).toBe(pointer.$element.css('transform'));
      });
    });
  });

  describe('setPositionAndUpdateTooltip(position, withTooltip, value)', () => {
    pointers.forEach((pointer) => {
      const expectPosition = makeRandomNumber(0, 100) / 100;
      const expectValue = makeRandomNumber(-100, 100);
      [!pointer.withTooltip, pointer.withTooltip].forEach((withTooltip) => {
        describe(`pointers[${pointers.indexOf(pointer)}], withTooltip: ${withTooltip}`, () => {
          test('pointer.setPosition(...) was called', () => {
            const spy = jest.spyOn(pointer, 'setPosition');
            pointer.setPositionAndUpdateTooltip(expectPosition, withTooltip, expectValue);
            expect(spy).toBeCalled();
            spy.mockReset().mockRestore();
          });
          test('pointer.updateTooltip(...) was called', () => {
            const spy = jest.spyOn(pointer, 'updateTooltip');
            pointer.setPositionAndUpdateTooltip(expectPosition, withTooltip, expectValue);
            expect(spy).toBeCalled();
            spy.mockReset().mockRestore();
          });
        });
      });
    });
  });

  describe('switchActive(isActive)', () => {
    pointers.forEach((pointer) => {
      [false, true].forEach((isActive) => {
        test(`pointers[${pointers.indexOf(pointer)}], isActive: ${isActive}`, () => {
          pointer.switchActive(isActive);
          expect(pointer.$element.hasClass(classes.active)).toBe(isActive);
        });
      });
    });
  });

  describe('subscribeOn(callback)', () => {
    const testCallback: PointerCallback = (pointerData: PointerData) => {
      testPointerData = pointerData;
    };
    pointers.forEach((pointer) => {
      test(`pointer[${pointers.indexOf(pointer)}] callback added to callbackList`, () => {
        pointer.subscribeOn(testCallback);
        expect(pointer.callbackList[0]).toEqual(testCallback);
      });
    });
  });

  describe('getShift(event)', () => {
    pointers.forEach((pointer) => {
      test(`pointers[${pointers.indexOf(pointer)}]: returned shift is as expected`, () => {
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
      });
    });
  });

  test('getNormalizePosition(position)', () => {
    const position = makeRandomNumber(0, 100) / 100;
    const expectResult = Math.round(position * normalizingCoefficient) / normalizingCoefficient;
    expect(expectResult).toBe(pointers[0].getNormalizePosition(position));
  });

  describe('setOrientation(orientation)', () => {
    pointers.forEach((pointer) => {
      describe(`pointers[${pointers.indexOf(pointer)}]`, () => {
        const lastOrientation = pointer.orientation;
        const newOrientation: ConfigOrientation = lastOrientation === 'horizontal'
          ? 'vertical'
          : 'horizontal';
        afterEach(() => {
          pointer.setOrientation(lastOrientation);
        });
        test('pointer.orientation equal new orientation', () => {
          pointer.setOrientation(newOrientation);
          expect(pointer.orientation).toBe(newOrientation);
        });
        test(`pointer.$element has class ${classes.root}_${newOrientation}`, () => {
          pointer.setOrientation(newOrientation);
          expect(pointer.$element.hasClass(`${classes.root}_${newOrientation}`)).toBe(true);
        });
        test(`pointer.$element has NOT class ${classes.root}_${lastOrientation}`, () => {
          pointer.setOrientation(newOrientation);
          expect(pointer.$element.hasClass(`${classes.root}_${lastOrientation}`)).toBe(false);
        });
        test('pointer.setPosition(...) was called', () => {
          const spy = jest.spyOn(pointer, 'setPosition');
          pointer.setOrientation(newOrientation);
          expect(spy).toHaveBeenCalledWith(pointer.position);
          spy.mockReset().mockRestore();
        });
        if (pointer.tooltip) {
          test('pointer.tooltip.setOrientation(...) was called', () => {
            const spy = pointer.tooltip
              ? jest.spyOn(pointer.tooltip, 'setOrientation')
              : jest.fn(() => {});
            pointer.setOrientation(newOrientation);
            expect(spy).toHaveBeenCalledWith(pointer.orientation);
            spy.mockReset().mockRestore();
          });
        }
      });
    });
  });

  describe('handlePointerMouseDown(event)', () => {
    pointers.forEach((pointer) => {
      describe(`pointers[${pointers.indexOf(pointer)}]`, () => {
        const testOffset = makeRandomNumber(1, 50);
        const testClient = makeRandomNumber(51, 100);
        const testOffsetContainer = makeRandomNumber(101, 150);
        const isHorizontal = pointer.orientation === 'horizontal';
        const fakeEvent: JQuery.MouseEventBase = new jQuery.Event('mousedown');
        fakeEvent.clientX = isHorizontal ? testClient : 0;
        fakeEvent.clientY = isHorizontal ? 0 : testClient;
        let spyOn = jest.spyOn(jQuery.fn, 'on');
        const expectContainerOffsetSize = pointer.orientation === 'horizontal'
          ? pointer.$container.outerWidth()
          : pointer.$container.outerHeight();
        beforeEach(() => {
          spyOn = jest.spyOn(jQuery.fn, 'on');
          jest.spyOn(pointer.$element, 'offset').mockReturnValue({
            left: isHorizontal ? testOffset : 0,
            top: isHorizontal ? 0 : testOffset,
          });
          jest.spyOn(pointer.$container, 'offset').mockReturnValue({
            left: isHorizontal ? testOffsetContainer : 0,
            top: isHorizontal ? 0 : testOffsetContainer,
          });
          pointer.handlePointerMouseDown(fakeEvent);
        });
        afterEach(() => {
          spyOn.mockReset().mockRestore();
        });
        test('pointer.shift was got correct value', () => {
          expect(pointer.shift).toBe(pointer.getShift(fakeEvent));
        });
        test('pointer.boundingClientRect was got correct value', () => {
          expect(pointer.boundingClientRect).toBe(testOffsetContainer);
        });
        test('pointer.containerOffsetSize was got correct value', () => {
          expect(pointer.containerOffsetSize).toBe(expectContainerOffsetSize);
        });
        test('pointer.handlePointerMove was added on mousemove event', () => {
          expect(spyOn).toHaveBeenNthCalledWith(1, 'mousemove', pointer.handlePointerMove);
        });
        test('pointer.handlePointerMouseUp was added on mouseup event', () => {
          expect(spyOn).toHaveBeenNthCalledWith(2, 'mouseup', pointer.handlePointerMouseUp);
        });
      });
    });
  });

  describe('handlePointerMove(event)', () => {
    pointers.forEach((pointer) => {
      test(`pointers[${pointers.indexOf(pointer)}] callback was received correct data`, () => {
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
  });

  describe('handlePointerMouseUp()', () => {
    pointers.forEach((pointer) => {
      describe(`pointers[${pointers.indexOf(pointer)}]`, () => {
        let spyOff = jest.spyOn(jQuery.fn, 'off');
        beforeEach(() => {
          spyOff = jest.spyOn(jQuery.fn, 'off');
          pointer.handlePointerMouseUp();
        });
        afterEach(() => {
          spyOff.mockReset().mockRestore();
        });
        test('on mouseup handlePointerMove() was removed first', () => {
          expect(spyOff).toHaveBeenNthCalledWith(1, 'mousemove', pointer.handlePointerMove);
        });
        test('on mouseup handlePointerMouseUp() was removed second', () => {
          expect(spyOff).toHaveBeenNthCalledWith(2, 'mouseup', pointer.handlePointerMouseUp);
        });
      });
    });
  });
});
