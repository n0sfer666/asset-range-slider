/* eslint-disable prefer-destructuring */
import Connect from '../../SimpleRangeSlider/View/entities/Connect';
import Pointer from '../../SimpleRangeSlider/View/entities/Pointer';
import Scale from '../../SimpleRangeSlider/View/entities/Scale';
import View from '../../SimpleRangeSlider/View/View';
import makeRandomNumber from '../makeRandomNumber';

describe('View', () => {
  const classes = {
    root: 'simple-range-slider',
    slider: 'simple-range-slider__slider',
    sliderContainer: 'simple-range-slider__slider-container',
    scale: 'simple-range-slider__scale',
    pointer: 'simple-range-slider__pointer',
    connect: 'simple-range-slider__connect',
  };
  const testConfigs: CompleteConfigList[] = [];
  const testOrientations: ConfigOrientation[] = ['horizontal', 'vertical'];
  const range: ConfigRange = [-1000, 1000];
  const testValues: PointerValue[] = [
    [makeRandomNumber(-900, 900)],
    [makeRandomNumber(-900, 0), makeRandomNumber(1, 900)],
  ];
  const testPosition: PointerPosition[] = testValues.map(
    (values) => <PointerPosition> values.map(
      (value) => (Math.round(((value - range[0]) / (range[1] - range[0])) * 1e4) / 1e4),
    ),
  );
  testOrientations.forEach((orientation, i) => {
    testValues.forEach((values, j) => {
      testConfigs.push({
        orientation,
        values,
        range,
        step: 1,
        withConnect: i % 2 === 0,
        withScale: j % 2 !== 0,
        withTooltip: i % 2 !== 0,
      });
    });
  });
  const views: View[] = [];
  testConfigs.forEach((config, index) => {
    const isHorizontal = config.orientation === 'horizontal';
    const size = `${isHorizontal ? 'width' : 'height'}: 300px; ${isHorizontal ? 'height' : 'width'}: 6px;`;
    views.push(new View(
      $('<div></div>', {
        class: `js-container-${index}`,
        style: `margin: 20px; ${size}`,
      }).appendTo($(document.body)),
      config,
      config.values.length === 1 ? testPosition[0] : testPosition[1],
    ));
  });
  let testViewData: ViewData = {
    activePointerIndex: NaN,
  };
  afterEach(() => {
    views.forEach((view, index) => {
      view.updateView({
        ...testConfigs[index],
        positions: index % 2 === 0 ? testPosition[0] : testPosition[1],
      });
    });
  });

  test('subscribeOn(callback)', () => {
    const callback: ViewCallback = (viewData) => {
      testViewData = viewData;
    };
    views.forEach((view) => {
      view.subscribeOn(callback);
    });
  });

  describe('getSliderElement(isContainer)', () => {
    [true, false].forEach((isContainer) => {
      describe(`isContainer: ${isContainer}`, () => {
        const className = isContainer ? classes.slider : classes.sliderContainer;
        const $element = jQuery('<div></div>', {
          class: `${className} ${className}_${testConfigs[0].orientation}`,
        });
        expect($element).toEqual(views[0].getSliderElement(isContainer));
      });
    });
  });

  describe('getPointer(position, index, value)', () => {
    const position = 0.25;
    const index = makeRandomNumber(0, 1);
    const value = 666;
    const pointer: Pointer = views[0].getPointer(position, index, value);
    test('pointer is instance of Pointer', () => {
      expect(pointer instanceof Pointer).toBe(true);
    });
    test('pointer has callback updateByPointer in callbackList', () => {
      expect(pointer.callbackList[0]).toEqual(views[0].updateByPointer);
    });
  });

  describe('getConnect(pointers)', () => {
    const testPointers: Pointer[][] = [
      [views[0].getPointer(0.1, 0, 10)],
      [
        views[0].getPointer(0.1, 0, 10),
        views[0].getPointer(0.9, 1, 90),
      ],
    ];
    testPointers.forEach((pointers) => {
      describe(`testPointers[${testPointers.indexOf(pointers)}]`, () => {
        const connect: Connect = views[0].getConnect(pointers);
        test('connect is instance of Connect', () => {
          expect(connect instanceof Connect).toBe(true);
        });
        if (pointers.length === 1) {
          describe(`connect of single pointer: ${pointers.length === 1}`, () => {
            test('startPosition is 0', () => {
              expect(connect.startPosition).toBe(0);
            });
            test(`endPosition is ${pointers[0].position}`, () => {
              expect(connect.endPosition).toBe(pointers[0].position);
            });
          });
        } else {
          describe(`connect of single pointer: ${pointers.length === 1}`, () => {
            test(`startPosition is ${pointers[0].position}`, () => {
              expect(connect.startPosition).toBe(pointers[0].position);
            });
            test(`endPosition is ${pointers[1].position}`, () => {
              expect(connect.endPosition).toBe(pointers[1].position);
            });
          });
        }
      });
    });
  });

  describe('getScale(range)', () => {
    const scale: Scale = views[0].getScale(range);
    test('scale is instance of Scale', () => {
      expect(scale instanceof Scale).toBe(true);
    });
    test('scale has callback updateByScale in callbackList', () => {
      expect(scale.callbackList[0]).toEqual(views[0].updateByScale);
    });
  });

  describe('initEntities(positions, values, range)', () => {
    views.forEach((view, index) => {
      describe(`views[${index}]`, () => {
        let spy = {
          getSliderElement: jest.spyOn(view, 'getSliderElement'),
          getPointer: jest.spyOn(view, 'getPointer'),
          getConnect: jest.spyOn(view, 'getConnect'),
          getScale: jest.spyOn(view, 'getScale'),
        };
        const positions: PointerPosition = <PointerPosition> testConfigs[index].values.map(
          (value) => Math.round(((value - range[0]) / (range[1] - range[0])) * 1e4) / 1e4,
        );
        beforeEach(() => {
          spy = {
            getSliderElement: jest.spyOn(view, 'getSliderElement'),
            getPointer: jest.spyOn(view, 'getPointer'),
            getConnect: jest.spyOn(view, 'getConnect'),
            getScale: jest.spyOn(view, 'getScale'),
          };
          view.initEntities(positions, testConfigs[index].values, range);
        });
        afterEach(() => {
          $.each(spy, (_, currentSpy) => {
            currentSpy.mockReset().mockRestore();
          });
        });
        test('getSliderElement(...) was NOT called', () => {
          expect(spy.getSliderElement).not.toBeCalled();
        });
        test(`getPointer(...) was called ${positions.length} times`, () => {
          expect(spy.getPointer).toBeCalledTimes(positions.length);
        });
        describe(`withConnect: ${testConfigs[index].withConnect}`, () => {
          if (testConfigs[index].withConnect) {
            test('getConnect(...) was called', () => {
              expect(spy.getConnect).toBeCalled();
            });
          } else {
            test('getConnect(...) was NOT called', () => {
              expect(spy.getConnect).not.toBeCalled();
            });
          }
        });
        describe(`withScale: ${testConfigs[index].withScale}`, () => {
          if (testConfigs[index].withScale) {
            test('getScale(...) was called', () => {
              expect(spy.getScale).toBeCalled();
            });
          } else {
            test('getScale(...) was NOT called', () => {
              expect(spy.getScale).not.toBeCalled();
            });
          }
        });
      });
    });
  });

  describe('drawSlider()', () => {
    testConfigs.forEach((config, index) => {
      describe(`views[${index}]`, () => {
        const $container = jQuery(`.js-container-${index}`);
        const $sliderContainer = $container.children();
        const $slider = $sliderContainer.find(`.${classes.slider}`);
        const $pointers = $slider.find(`.${classes.pointer}`);
        test(`$sliderContainer has class ${classes.sliderContainer}`, () => {
          expect($sliderContainer.hasClass(classes.sliderContainer)).toBe(true);
        });
        test('$slider in $sliderContainer', () => {
          expect($slider.length).toBe(1);
        });
        test(`pointers in $slider; length is ${config.values.length}`, () => {
          expect($pointers.length).toBe(config.values.length);
        });
        describe(`withScale: ${config.withScale}`, () => {
          const $scale = $sliderContainer.find(`.${classes.scale}`);
          if (config.withScale) {
            test('$scale in $sliderContainer', () => {
              expect($scale.length).toBe(1);
            });
            test('$scale has correct order in $sliderContainer', () => {
              expect($scale.index()).toBe(config.orientation === 'horizontal' ? 1 : 0);
            });
          } else {
            test('$scale NOT in $sliderContainer', () => {
              expect($scale.length).toBe(0);
            });
          }
        });
        describe(`withConnect: ${config.withConnect}`, () => {
          const $connect = $slider.find(`.${classes.connect}`);
          if (config.withConnect) {
            test('$connect in $slider', () => {
              expect($connect.length).toBe(1);
            });
          } else {
            test('$connect NOT in $slider', () => {
              expect($connect.length).toBe(0);
            });
          }
        });
      });
    });
  });

  describe('updateByPointer(pointerData)', () => {
    views.forEach((view) => {
      describe(`views[${views.indexOf(view)}]`, () => {
        const pointerData: PointerData = {
          position: NaN,
          index: NaN,
        };
        beforeEach(() => {
          pointerData.position = Math.round(Math.random() * 1e4) / 1e4;
          pointerData.index = makeRandomNumber(0, 1);
          view.updateByPointer(pointerData);
        });
        test('index is as expected', () => {
          setTimeout(() => {
            expect(pointerData.index).toBe(testViewData.activePointerIndex);
          }, 5);
        });
        test('position is as expected', () => {
          setTimeout(() => {
            expect(pointerData.position).toBe(testViewData.position);
          }, 5);
        });
      });
    });
  });

  describe('updateByScape(scaleData)', () => {
    views.forEach((view, index) => {
      describe(`views[${index}]`, () => {
        const scaleData: ScaleData = {
          value: NaN,
        };
        const isSinglePointer = testConfigs[index].values.length === 1;
        beforeEach(() => {
          scaleData.value = makeRandomNumber(-100, 100);
          view.updateByScale(scaleData);
        });
        test('value is as expected', () => {
          setTimeout(() => {
            expect(scaleData.value).toBe(testViewData.value);
          }, 5);
        });
        describe(`isSinglePointer: ${isSinglePointer}`, () => {
          if (isSinglePointer) {
            test('activePointerIndex is 0', () => {
              setTimeout(() => {
                expect(testViewData.activePointerIndex).toBe(0);
              }, 5);
            });
          } else {
            const difference = testConfigs[index].values.map(
              (value) => Math.abs(scaleData.value - value),
            );
            const expectedActivePointerIndex = difference[0] < difference[1] ? 0 : 1;
            test(`activePointerIndex is ${expectedActivePointerIndex}`, () => {
              setTimeout(() => {
                expect(expectedActivePointerIndex).toBe(testViewData.activePointerIndex);
              }, 5);
            });
          }
        });
      });
    });
  });

  describe('updateByModel(modelData)', () => {
    views.forEach((view, index) => {
      describe(`views[${index}]`, () => {
        const isSinglePointer = testConfigs[index].values.length === 1;
        let spies = {
          connect: view.entities.connect
            ? jest.spyOn(view.entities.connect, 'setPosition')
            : jest.fn(),
          pointers: view.entities.pointers.map(
            (pointer) => jest.spyOn(pointer, 'setPositionAndUpdateTooltip'),
          ),
          view: jest.spyOn(view, 'switchActivePointer'),
        };
        const modelData: ModelData = {
          index: isSinglePointer
            ? 0
            : makeRandomNumber(0, 1),
          positions: isSinglePointer
            ? [makeRandomNumber(0, 100) / 100]
            : [makeRandomNumber(0, 50), makeRandomNumber(51, 100)],
          values: isSinglePointer
            ? [makeRandomNumber(-100, 100)]
            : [makeRandomNumber(-100, 0), makeRandomNumber(1, 100)],
        };
        beforeEach(() => {
          spies = {
            connect: view.entities.connect
              ? jest.spyOn(view.entities.connect, 'setPosition')
              : jest.fn(),
            pointers: view.entities.pointers.map(
              (pointer) => jest.spyOn(pointer, 'setPositionAndUpdateTooltip'),
            ),
            view: jest.spyOn(view, 'switchActivePointer'),
          };
          view.updateByModel(modelData);
        });
        afterEach(() => {
          $.each(spies, (_, spy) => {
            if (Array.isArray(spy)) {
              spy.forEach((currentSpy) => {
                currentSpy.mockReset().mockRestore();
              });
            } else {
              spy.mockReset().mockRestore();
            }
          });
        });
        test('switchActivePointer was called', () => {
          expect(spies.view).toBeCalled();
        });
        // * Need to fixed
        spies.pointers.forEach((spy, i) => {
          test(`pointer[${i}] setPositionAndUpdateTooltip(...) was called`, () => {
            setTimeout(() => {
              expect(spy).toBeCalled();
            }, 5);
          });
        });
        describe(`entities.connect: ${!!view.entities.connect}`, () => {
          if (view.entities.connect) {
            test('entities.connect.setPosition(...) was called', () => {
              expect(spies.connect).toBeCalled();
            });
          } else {
            test('entities.connect.setPosition(...) was NOT called', () => {
              expect(spies.connect).not.toBeCalled();
            });
          }
        });
      });
    });
  });

  describe('updateScale(range)', () => {
    views.forEach((view, index) => {
      describe(`views[${index}]`, () => {
        let spies = {
          viewGetScale: jest.spyOn(view, 'getScale'),
          jQueryRemove: jest.spyOn(jQuery.fn, 'remove'),
        };
        beforeEach(() => {
          spies = {
            viewGetScale: jest.spyOn(view, 'getScale'),
            jQueryRemove: jest.spyOn(jQuery.fn, 'remove'),
          };
          view.updateScale(range);
        });
        afterEach(() => {
          $.each(spies, (_, spy) => {
            spy.mockReset().mockRestore();
          });
        });
        describe(`withScale: ${testConfigs[index].withScale}`, () => {
          if (testConfigs[index].withScale) {
            test('getScale(...) was called', () => {
              expect(spies.viewGetScale).toBeCalled();
            });
          } else {
            test('entities.scale.$element was removed', () => {
              expect(spies.jQueryRemove).not.toBeCalled();
            });
            test('entities.scale is NULL', () => {
              expect(view.entities.scale).toBe(null);
            });
          }
        });
      });
    });
  });

  describe('updatePositions(positions, values) &&', () => {
    views.forEach((view) => {
      describe(`views[${views.indexOf(view)}]`, () => {
        const spies = {
          updatePointerAndTooltip: jest.spyOn(view, 'updatePointerAndTooltip'),
          updateByModel: jest.spyOn(view, 'updateByModel'),
        };
        const positions: PointerPosition = [makeRandomNumber(0, 50) / 100];
        const values: PointerValue = [makeRandomNumber(range[0], 0)];
        [false, true].forEach((isAddedPointer) => {
          if (isAddedPointer) {
            positions.push(makeRandomNumber(51, 99) / 100);
            values.push(makeRandomNumber(1, range[1] - 1));
          }
          let lastPointerLength = view.entities.pointers.length;
          let newPointerLength = values.length;
          describe(`pointers length is different: ${lastPointerLength !== newPointerLength}`, () => {
            beforeEach(() => {
              lastPointerLength = view.entities.pointers.length;
              newPointerLength = values.length;
              spies.updateByModel = jest.spyOn(view, 'updateByModel');
              spies.updatePointerAndTooltip = jest.spyOn(view, 'updatePointerAndTooltip');
              view.updatePositions(positions, values);
            });
            afterEach(() => {
              $.each(spies, (_, spy) => {
                spy.mockReset().mockRestore();
              });
            });
            test('updateByModel(...) was called', () => {
              expect(spies.updateByModel).toBeCalled();
            });
            if (lastPointerLength !== newPointerLength) {
              test('updatePointerAndTooltip(...) was called', () => {
                setTimeout(() => {
                  expect(spies.updatePointerAndTooltip).toBeCalled();
                }, 5);
              });
              if (lastPointerLength === 1) {
                test('pointer length change to 2', () => {
                  setTimeout(() => {
                    expect(view.entities.pointers.length).toBe(2);
                  }, 5);
                });
              } else {
                test('pointer length change to 1', () => {
                  setTimeout(() => {
                    expect(view.entities.pointers.length).toBe(1);
                  }, 5);
                });
              }
            }
          });
        });
      });
    });
  });

  describe('updateConnect()', () => {
    views.forEach((view, index) => {
      describe(`views[${index}], withConnect: ${testConfigs[index].withConnect}`, () => {
        let spyViewGetConnect = jest.spyOn(view, 'getConnect');
        beforeEach(() => {
          spyViewGetConnect = jest.spyOn(view, 'getConnect');
          view.updateConnect();
        });
        afterEach(() => {
          spyViewGetConnect.mockReset().mockRestore();
        });
        if (testConfigs[index].withConnect) {
          test('getConnect(...) was called', () => {
            expect(spyViewGetConnect).toBeCalled();
          });
        } else {
          test('entities.connect is NULL', () => {
            expect(view.entities.connect).toBe(null);
          });
        }
      });
    });
  });

  describe('updateOrientation(orientation)', () => {
    views.forEach((view, index) => {
      describe(`views[${index}]`, () => {
        const newOrientations: ConfigOrientation[] = makeRandomNumber(0, 1)
          ? ['horizontal', 'vertical']
          : ['vertical', 'horizontal'];
        newOrientations.forEach((orientation, i) => {
          describe(`newOrientations: ${orientation}`, () => {
            let spies = {
              removeClass: jest.spyOn($.fn, 'removeClass'),
              addClass: jest.spyOn($.fn, 'addClass'),
              pointerSetOrientation: view.entities.pointers.map((pointer) => jest.spyOn(pointer, 'setOrientation')),
              connectSetOrientation: view.entities.connect ? jest.spyOn(view.entities.connect, 'setOrientation') : jest.fn(),
              scaleSetOrientation: view.entities.scale ? jest.spyOn(view.entities.scale, 'setOrientation') : jest.fn(),
            };
            const expectOrientationToRemove = i === 0
              ? testConfigs[index].orientation
              : newOrientations[0];
            beforeEach(() => {
              spies = {
                removeClass: jest.spyOn($.fn, 'removeClass'),
                addClass: jest.spyOn($.fn, 'addClass'),
                pointerSetOrientation: view.entities.pointers.map((pointer) => jest.spyOn(pointer, 'setOrientation')),
                connectSetOrientation: view.entities.connect ? jest.spyOn(view.entities.connect, 'setOrientation') : jest.fn(),
                scaleSetOrientation: view.entities.scale ? jest.spyOn(view.entities.scale, 'setOrientation') : jest.fn(),
              };
              view.updateOrientation(orientation);
            });
            afterEach(() => {
              $.each(spies, (_, spy) => {
                if (Array.isArray(spy)) {
                  spy.forEach((spyMock) => {
                    spyMock.mockReset().mockRestore();
                  });
                } else {
                  spy.mockReset().mockRestore();
                }
              });
            });
            test(`class ${classes.slider}_${expectOrientationToRemove} was removed`, () => {
              setTimeout(() => {
                expect(spies.removeClass).toHaveBeenCalledWith(
                  `${classes.slider}_${expectOrientationToRemove}`,
                  `${classes.sliderContainer}_${expectOrientationToRemove}`,
                );
              }, 5);
            });
            test(` class ${classes.slider}_${orientation} was added`, () => {
              setTimeout(() => {
                expect(spies.addClass).toHaveBeenCalledWith(
                  `${classes.slider}_${orientation}`,
                  `${classes.sliderContainer}_${orientation}`,
                );
              }, 5);
            });
            spies.pointerSetOrientation.forEach((spy, j) => {
              test(`pointer[${j}].setOrientation(...) was called`, () => {
                setTimeout(() => {
                  expect(spy).toBeCalledWith(orientation);
                }, 5);
              });
            });
            describe(`entities.connect is ${!!view.entities.connect}`, () => {
              if (view.entities.connect) {
                test('entities.connect.setOrientation was called', () => {
                  expect(spies.connectSetOrientation).toBeCalled();
                });
              } else {
                test('entities.connect.setOrientation(...) was NOT called', () => {
                  expect(spies.connectSetOrientation).not.toBeCalled();
                });
              }
            });
            describe(`entities.scale is ${!!view.entities.scale}`, () => {
              if (view.entities.scale) {
                test('entities.scale.setOrientation(...) was called', () => {
                  expect(spies.scaleSetOrientation).toBeCalled();
                });
              } else {
                test('entities.scale.setOrientation(...) was NOT called', () => {
                  expect(spies.scaleSetOrientation).not.toBeCalled();
                });
              }
            });
          });
        });
      });
    });
  });

  describe('updateView(viewUpdateList)', () => {
    views.forEach((view, index) => {
      describe(`views[${index}]`, () => {
        const viewUpdateList: ViewUpdateList = {
          positions: testConfigs[index].values.length === 1
            ? [0.1234, 0.4321]
            : [0.1234],
          values: testConfigs[index].values.length === 1
            ? [-10, 10]
            : [1],
          range: [-1500, 1500],
          step: makeRandomNumber(1, 100),
          orientation: makeRandomNumber(0, 1) ? 'horizontal' : 'vertical',
          withTooltip: !!makeRandomNumber(0, 1),
          withConnect: !!makeRandomNumber(0, 1),
          withScale: !!makeRandomNumber(0, 1),
        };
        const {
          positions, orientation, withTooltip, withConnect, withScale,
        } = viewUpdateList;
        // eslint-disable-next-line @typescript-eslint/dot-notation
        const config: CompleteConfigList = view['config'];
        const isOrientationChanged = orientation !== config.orientation;
        const isConnectChanged = withConnect !== config.withConnect;
        const isTooltipChanged = withTooltip !== config.withTooltip;
        const isScaleChanged = withScale !== config.withScale;
        const isRangeChanged = [...viewUpdateList.range] !== [...config.range];
        // eslint-disable-next-line @typescript-eslint/dot-notation
        const isPositionsChanged = [...positions] !== [...view['positions']];
        const withScaleFromStart = !!view.entities.scale;
        const isUpdatedScaleByScale = isRangeChanged && view.entities.scale && withScaleFromStart;
        let spies = {
          updateOrientation: jest.spyOn(view, 'updateOrientation'),
          updateConnect: jest.spyOn(view, 'updateConnect'),
          updateTooltip: view.entities.pointers.map((pointer) => jest.spyOn(pointer, 'updateTooltip')),
          updateScale: jest.spyOn(view, 'updateScale'),
          updateScaleByScale: view.entities.scale
            ? jest.spyOn(view.entities.scale, 'updateScale')
            : jest.fn(),
          updatePosition: jest.spyOn(view, 'updatePositions'),
        };
        beforeEach(() => {
          spies = {
            updateOrientation: jest.spyOn(view, 'updateOrientation'),
            updateConnect: jest.spyOn(view, 'updateConnect'),
            updateTooltip: view.entities.pointers.map((pointer) => jest.spyOn(pointer, 'updateTooltip')),
            updateScale: jest.spyOn(view, 'updateScale'),
            updateScaleByScale: view.entities.scale
              ? jest.spyOn(view.entities.scale, 'updateScale')
              : jest.fn(),
            updatePosition: jest.spyOn(view, 'updatePositions'),
          };
          view.updateView(viewUpdateList);
        });
        afterEach(() => {
          $.each(spies, (_, spy) => {
            if (Array.isArray(spy)) {
              spy.forEach((currentSpy) => (currentSpy.mockReset().mockRestore()));
            } else {
              spy.mockReset().mockRestore();
            }
          });
        });
        $.each(viewUpdateList, (key, value) => {
          describe(`viewUpdateList.${key}`, () => {
            if (key !== 'positions') {
              test(`viewUpdateList.${key} === view.config.${key}`, () => {
                // eslint-disable-next-line @typescript-eslint/dot-notation
                expect(value).toEqual(view['config'][key]);
              });
            } else {
              test(`viewUpdateList.${key} === view.${key}`, () => {
                // eslint-disable-next-line @typescript-eslint/dot-notation
                expect(value).toEqual(view['positions']);
              });
            }
          });
        });
        describe(`isOrientationChanged: ${isOrientationChanged}`, () => {
          if (isOrientationChanged) {
            test('updateOrientation was called', () => {
              expect(spies.updateOrientation).toBeCalled();
            });
          } else {
            test('updateOrientation was NOT called', () => {
              expect(spies.updateOrientation).not.toBeCalled();
            });
          }
        });
        describe(`isConnectChanged: ${isConnectChanged}`, () => {
          if (isConnectChanged) {
            test('updateConnect was called', () => {
              expect(spies.updateConnect).toBeCalled();
            });
          } else {
            test('updateConnect was NOT called', () => {
              expect(spies.updateConnect).not.toBeCalled();
            });
          }
        });
        describe(`isTooltipChanged: ${isTooltipChanged}`, () => {
          if (isTooltipChanged) {
            spies.updateTooltip.forEach((spy, i) => {
              test(`pointer[${i}]: updateTooltip was called`, () => {
                setTimeout(() => {
                  expect(spy).toBeCalled();
                }, 5);
              });
            });
          } else {
            spies.updateTooltip.forEach((spy, i) => {
              test(`pointer[${i}]: updateTooltip was NOT called`, () => {
                setTimeout(() => {
                  expect(spy).not.toBeCalled();
                }, 5);
              });
            });
          }
        });
        describe(`isScaleChanged: ${isScaleChanged}`, () => {
          if (isScaleChanged) {
            test('updateScale was called', () => {
              expect(spies.updateScale).toBeCalled();
            });
          } else {
            test('updateScale was NOT called', () => {
              expect(spies.updateScale).not.toBeCalled();
            });
          }
        });
        describe(`isUpdatedScaleByScale: ${isUpdatedScaleByScale}`, () => {
          if (isUpdatedScaleByScale) {
            test('entities.scale.updateScale was called', () => {
              setTimeout(() => {
                expect(spies.updateScaleByScale).toBeCalled();
              }, 5);
            });
          } else {
            test('entities.scale.updateScale was NOT called', () => {
              expect(spies.updateScaleByScale).not.toBeCalled();
            });
          }
        });
        describe(`isPositionsChanged: ${isPositionsChanged}`, () => {
          if (isPositionsChanged) {
            test('updatePosition was called', () => {
              expect(spies.updatePosition).toBeCalled();
            });
          } else {
            test('updatePosition was NOT called', () => {
              expect(spies.updatePosition).not.toBeCalled();
            });
          }
        });
      });
    });
  });
});
