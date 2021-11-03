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
  testOrientations.forEach((orientation) => {
    testValues.forEach((values) => {
      testConfigs.push({
        orientation,
        values,
        range,
        step: 1,
        withConnect: !!makeRandomNumber(0, 1),
        withScale: !!makeRandomNumber(0, 1),
        withTooltip: !!makeRandomNumber(0, 1),
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

  test('subscribeOn(callback)', () => {
    const callback: ViewCallback = (viewData) => {
      testViewData = viewData;
    };
    views.forEach((view) => {
      view.subscribeOn(callback);
    });
  });

  test('getSliderElement(isContainer)', () => {
    [true, false].forEach((isContainer) => {
      const className = isContainer ? classes.slider : classes.sliderContainer;
      const $element = jQuery('<div></div>', {
        class: `${className} ${className}_${testConfigs[0].orientation}`,
      });
      expect($element).toEqual(views[0].getSliderElement(isContainer));
    });
  });

  test('getPointer(position, index, value)', () => {
    const position = 0.25;
    const index = makeRandomNumber(0, 1);
    const value = 666;
    const pointer: Pointer = views[0].getPointer(position, index, value);
    expect(pointer instanceof Pointer).toBe(true);
    expect(pointer.callbackList[0]).toEqual(views[0].updateByPointer);
  });

  test('getConnect(pointers)', () => {
    const testPointers: Pointer[][] = [
      [views[0].getPointer(0.1, 0, 10)],
      [
        views[0].getPointer(0.1, 0, 10),
        views[0].getPointer(0.9, 1, 90),
      ],
    ];
    testPointers.forEach((pointers) => {
      const connect: Connect = views[0].getConnect(pointers);
      expect(connect instanceof Connect).toBe(true);
      if (pointers.length === 1) {
        expect(connect.startPosition).toBe(0);
        expect(connect.endPosition).toBe(pointers[0].position);
      } else {
        expect(connect.startPosition).toBe(pointers[0].position);
        expect(connect.endPosition).toBe(pointers[1].position);
      }
    });
  });

  test('getScale(range)', () => {
    const scale: Scale = views[0].getScale(range);
    expect(scale instanceof Scale).toBe(true);
    expect(scale.callbackList[0]).toEqual(views[0].updateByScale);
  });

  test('initEntities(positions, values, range)', () => {
    views.forEach((view, index) => {
      const spy = {
        getSliderElement: jest.spyOn(view, 'getSliderElement'),
        getPointer: jest.spyOn(view, 'getPointer'),
        getConnect: jest.spyOn(view, 'getConnect'),
        getScale: jest.spyOn(view, 'getScale'),
      };
      const positions: PointerPosition = <PointerPosition> testConfigs[index].values.map(
        (value) => Math.round(((value - range[0]) / (range[1] - range[0])) * 1e4) / 1e4,
      );
      view.initEntities(positions, testConfigs[index].values, range);
      expect(spy.getSliderElement).not.toBeCalled();
      expect(spy.getPointer).toBeCalledTimes(positions.length);
      if (testConfigs[index].withConnect) {
        expect(spy.getConnect).toBeCalled();
      }
      if (testConfigs[index].withScale) {
        expect(spy.getScale).toBeCalled();
      }
      $.each(spy, (_, currentSpy) => {
        currentSpy.mockReset().mockRestore();
      });
    });
  });

  test('drawSlider()', () => {
    testConfigs.forEach((config, index) => {
      const $container = jQuery(`.js-container-${index}`);
      const $sliderContainer = $container.children();
      expect($sliderContainer.hasClass(classes.sliderContainer)).toBe(true);
      const $slider = $sliderContainer.find(`.${classes.slider}`);
      expect($slider.length).toBe(1);
      if (config.withScale) {
        const $scale = $sliderContainer.find(`.${classes.scale}`);
        expect($scale.length).toBe(1);
        expect($scale.index()).toBe(config.orientation === 'horizontal' ? 1 : 0);
      } else {
        expect($sliderContainer.children().length).toBe(1);
      }
      const $pointers = $slider.find(`.${classes.pointer}`);
      expect($pointers.length).toBe(config.values.length);
      if (config.withConnect) {
        const $connect = $slider.find(`.${classes.connect}`);
        expect($connect.length).toBe(1);
      }
    });
  });

  test('updateByPointer(pointerData)', () => {
    views.forEach((view) => {
      const pointerData: PointerData = {
        position: Math.round(Math.random() * 1e4) / 1e4,
        index: makeRandomNumber(0, 1),
      };
      view.updateByPointer(pointerData);
      expect(pointerData.index).toBe(testViewData.activePointerIndex);
      expect(pointerData.position).toBe(testViewData.position);
    });
  });

  test('updateByScape(scaleData)', () => {
    views.forEach((view, index) => {
      const scaleData: ScaleData = {
        value: makeRandomNumber(-100, 100),
      };
      view.updateByScale(scaleData);
      expect(scaleData.value).toBe(testViewData.value);
      const isSinglePointer = testConfigs[index].values.length === 1;
      if (isSinglePointer) {
        expect(testViewData.activePointerIndex).toBe(0);
      } else {
        const difference = testConfigs[index].values.map(
          (value) => Math.abs(scaleData.value - value),
        );
        expect(difference[0] < difference[1] ? 0 : 1).toBe(testViewData.activePointerIndex);
      }
    });
  });

  test('updateByModel(modelData)', () => {
    views.forEach((view, index) => {
      const isSinglePointer = testConfigs[index].values.length === 1;
      const spyConnect = view.entities.connect
        ? jest.spyOn(view.entities.connect, 'setPosition')
        : jest.fn();
      const spyPointers = view.entities.pointers.map(
        (pointer) => jest.spyOn(pointer, 'setPositionAndUpdateTooltip'),
      );
      const spyView = jest.spyOn(view, 'switchActivePointer');
      const modelData: ModelData = {
        index: isSinglePointer ? 0 : makeRandomNumber(0, 1),
        positions: [makeRandomNumber(0, 50) / 100],
        values: [makeRandomNumber(-1000, 0)],
      };
      if (!isSinglePointer) {
        modelData.positions.push(makeRandomNumber(51, 99) / 100);
        modelData.values.push(makeRandomNumber(1, 999));
      }
      view.updateByModel(modelData);
      spyPointers.forEach((spy) => {
        expect(spy).toBeCalled();
        spy.mockReset().mockRestore();
      });
      expect(spyView).toBeCalled();
      spyView.mockReset().mockRestore();
      if (view.entities.connect) {
        expect(spyConnect).toBeCalled();
        spyConnect.mockReset().mockRestore();
      }
    });
  });

  test('updateScale(range)', () => {
    views.forEach((view, index) => {
      const spyViewGetScale = jest.spyOn(view, 'getScale');
      view.updateScale(range);
      if (testConfigs[index].withScale) {
        expect(spyViewGetScale).toBeCalledWith(range);
      } else {
        expect(view.entities.scale).toBe(null);
      }
      spyViewGetScale.mockReset().mockRestore();
    });
  });

  test('updatePositions(positions, values) &&', () => {
    views.forEach((view) => {
      const spyView = {
        updatePointerAndTooltip: jest.spyOn(view, 'updatePointerAndTooltip'),
        updateByModel: jest.spyOn(view, 'updateByModel'),
      };
      const positions: PointerPosition = [makeRandomNumber(0, 50) / 100];
      const values: PointerValue = [makeRandomNumber(range[0], 0)];
      if (makeRandomNumber(0, 1)) {
        positions.push(makeRandomNumber(51, 99) / 100);
        values.push(makeRandomNumber(1, range[1] - 1));
      }
      const lastPointerLength = view.entities.pointers.length;
      const newPointerLength = values.length;
      view.updatePositions(positions, values);
      if (lastPointerLength !== newPointerLength) {
        expect(spyView.updatePointerAndTooltip).toBeCalledWith(newPointerLength, positions, values);
        if (lastPointerLength === 1) {
          expect(view.entities.pointers.length).toBe(2);
        } else {
          expect(view.entities.pointers.length).toBe(1);
        }
      }
      expect(spyView.updateByModel).toBeCalled();
    });
  });

  test('updateConnect()', () => {
    views.forEach((view, index) => {
      const spyViewGetConnect = jest.spyOn(view, 'getConnect');
      view.updateConnect();
      if (testConfigs[index].withConnect) {
        expect(spyViewGetConnect).toBeCalledWith(view.entities.pointers);
      } else {
        expect(view.entities.connect).toBe(null);
      }
    });
  });

  test('updateOrientation(orientation)', () => {
    views.forEach((view, index) => {
      const newOrientations: ConfigOrientation[] = makeRandomNumber(0, 1)
        ? ['horizontal', 'vertical']
        : ['vertical', 'horizontal'];
      newOrientations.forEach((orientation, i) => {
        const spies = {
          removeClass: jest.spyOn($.fn, 'removeClass'),
          addClass: jest.spyOn($.fn, 'addClass'),
          pointerSetOrientation: view.entities.pointers.map((pointer) => jest.spyOn(pointer, 'setOrientation')),
          connectSetOrientation: view.entities.connect ? jest.spyOn(view.entities.connect, 'setOrientation') : jest.fn(),
          scaleSetOrientation: view.entities.scale ? jest.spyOn(view.entities.scale, 'setOrientation') : jest.fn(),
        };
        view.updateOrientation(orientation);
        const expectOrientationToRemove = i === 0
          ? testConfigs[index].orientation
          : newOrientations[0];
        expect(spies.removeClass).toHaveBeenNthCalledWith(1, `${classes.slider}_${expectOrientationToRemove}`);
        expect(spies.removeClass).toHaveBeenNthCalledWith(2, `${classes.sliderContainer}_${expectOrientationToRemove}`);
        expect(spies.addClass).toHaveBeenNthCalledWith(1, `${classes.slider}_${orientation}`);
        expect(spies.addClass).toHaveBeenNthCalledWith(2, `${classes.sliderContainer}_${orientation}`);

        spies.pointerSetOrientation.forEach((spy) => {
          expect(spy).toBeCalledWith(orientation);
        });
        if (view.entities.connect) {
          expect(spies.connectSetOrientation).toBeCalledWith(orientation);
        }
        if (view.entities.scale) {
          expect(spies.scaleSetOrientation).toBeCalledWith(orientation);
        }

        jQuery.each(spies, (_, spy) => {
          if (Array.isArray(spy)) {
            spy.forEach((spyMock) => {
              spyMock.mockReset().mockRestore();
            });
          } else {
            spy.mockReset().mockRestore();
          }
        });
      });
    });
  });

  test('updateView(viewUpdateList)', () => {
    views.forEach((view, index) => {
      const viewUpdateList: ViewUpdateList = {
        positions: testConfigs[index].values.length === 1
          ? [0.1234, 0.4321]
          : [0.1234],
        values: testConfigs[index].values.length === 1
          ? [-10, 10]
          : [1],
        range: [-1500, 1500],
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
      const isRangeChanged = JSON.stringify(viewUpdateList.range) !== JSON.stringify(config.range);
      const isPositionsChanged = JSON.stringify(positions) !== JSON.stringify(config.positions);
      const withScaleFromStart = !!view.entities.scale;
      const spies = {
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
      $.each(viewUpdateList, (key, value) => {
        if (key !== 'positions') {
          // eslint-disable-next-line @typescript-eslint/dot-notation
          expect(value).toEqual(view['config'][key]);
        } else {
          // eslint-disable-next-line @typescript-eslint/dot-notation
          expect(value).toEqual(view['positions']);
        }
      });
      if (isOrientationChanged) {
        expect(spies.updateOrientation).toBeCalled();
      }
      if (isConnectChanged) {
        expect(spies.updateConnect).toBeCalled();
      }
      if (isTooltipChanged) {
        view.entities.pointers.forEach((_, i) => {
          expect(spies.updateTooltip[i]).toBeCalled();
        });
      }
      if (isScaleChanged) {
        expect(spies.updateScale).toBeCalled();
      }
      const isUpdatedScaleByScale = isRangeChanged && view.entities.scale && withScaleFromStart;
      if (isUpdatedScaleByScale) {
        expect(spies.updateScaleByScale).toBeCalled();
      }
      if (isPositionsChanged) {
        expect(spies.updatePosition).toBeCalled();
      }
      $.each(spies, (_, spy) => {
        if (Array.isArray(spy)) {
          spy.forEach((currentSpy) => (currentSpy.mockReset().mockRestore()));
        } else {
          spy.mockReset().mockRestore();
        }
      });
    });
  });
});
