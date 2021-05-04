import Panel from '../../../DemoPanel/entities/Panel';
import SimpleRangeSlider from '../../../SimpleRangeSlider/SimpleRangeSlider';
import makeRandomNumber from '../../makeRandomNumber';

describe('Panel.ts', () => {
  const testConfig: iCompleteConfig = {
    orientation: 'horizontal',
    start: [10],
    range: [0, 100],
    step: 10,
    connect: true,
    tooltip: true,
    scale: true,
  };
  const testInstance = new Panel(testConfig);
  $(document.body).append(testInstance.mainContainers.$main);

  test('getInputs()', () => {
    const {
      start, step, range, scale, connect, tooltip,
    } = testConfig;
    const expectInputs: iInputs = {
      $control: start.map((value, index) => testInstance.getConfigInputElement(value, index)),
      $orientation: [
        testInstance.getRadioElement('horizontal', 'orientation', testInstance.isHorizontal),
        testInstance.getRadioElement('vertical', 'orientation', !testInstance.isHorizontal),
      ],
      $range: range.map((value, index) => testInstance.getConfigInputElement(value, index, 'range')),
      $start: start.map((value, index) => testInstance.getConfigInputElement(value, index, 'start')),
      $step: [testInstance.getConfigInputElement(step, 0, 'step')],
      $scale: [
        testInstance.getRadioElement('enable', 'scale', scale),
        testInstance.getRadioElement('disable', 'scale', !scale),
      ],
      $connect: [
        testInstance.getRadioElement('enable', 'connect', connect),
        testInstance.getRadioElement('disable', 'connect', !connect),
      ],
      $tooltip: [
        testInstance.getRadioElement('enable', 'tooltip', tooltip),
        testInstance.getRadioElement('disable', 'tooltip', !tooltip),
      ],
    };
    expect(expectInputs).toEqual(testInstance.getInputs());
  });

  test('getContainers()', () => {
    const expectContainers: iContainers = {
      $control: testInstance.getContainerElement(),
      $orientation: testInstance.getContainerElement(),
      $range: testInstance.getContainerElement(),
      $start: testInstance.getContainerElement(),
      $step: testInstance.getContainerElement(),
      $scale: testInstance.getContainerElement(),
      $connect: testInstance.getContainerElement(),
      $tooltip: testInstance.getContainerElement(),
    };
    expect(expectContainers).toEqual(testInstance.getContainers());
  });

  test('getMainContainers()', () => {
    const expectMainContainers: iMainContainers = {
      $main: testInstance.getContainerElement('main'),
      $slider: testInstance.getContainerElement('slider'),
      $config: testInstance.getContainerElement('config'),
    };
    expect(expectMainContainers).toEqual(testInstance.getMainContainers());
  });

  test('getTitles()', () => {
    const expectTitles: iTitles = {
      $main: testInstance.getTextElement({ isTitle: true, text: 'Demo Panel' }),
      $slider: testInstance.getTextElement({ isTitle: true, text: 'Slider' }),
      $config: testInstance.getTextElement({ isTitle: true, text: 'Config' }),
      $control: testInstance.getTextElement({ text: 'control' }),
      $orientation: testInstance.getTextElement({ text: 'orientation' }),
      $range: testInstance.getTextElement({ text: 'range' }),
      $start: testInstance.getTextElement({ text: 'start' }),
      $step: testInstance.getTextElement({ text: 'step' }),
      $scale: testInstance.getTextElement({ text: 'scale' }),
      $connect: testInstance.getTextElement({ text: 'connect' }),
      $tooltip: testInstance.getTextElement({ text: 'tooltip' }),
    };
    expect(expectTitles).toEqual(testInstance.getTitles());
  });

  test('initPanel()', () => {
    const {
      mainContainers,
      containers,
      inputs,
      titles,
      $inputCheckboxTooltip,
      $buttonPointerCountControl,
      config,
    } = testInstance;
    expect(mainContainers.$slider.parent())
      .toEqual(mainContainers.$main);
    expect(mainContainers.$config.parent())
      .toEqual(mainContainers.$main);
    if (config.input) {
      expect(config.input.$values).toEqual(inputs.$control);
      expect(config.input.$tooltip)
        .toEqual($inputCheckboxTooltip.find('input'));
    }
    expect($inputCheckboxTooltip.parent()).toEqual(containers.$control);
    $.each(titles, (key) => {
      if (mainContainers[key]) {
        expect(titles[key].parent()).toEqual(mainContainers[key]);
      } else {
        expect(titles[key].parent()).toEqual(containers[key]);
        expect(containers[key].parent()).toEqual(mainContainers.$config);
        if (key === 'start') {
          expect($buttonPointerCountControl.parent()).toEqual(containers[key]);
        }
        inputs[key].forEach(($input: JQuery) => {
          expect($input.parent()).toEqual(containers[key]);
        });
      }
    });
  });

  test('bind handlers', () => {
    const { inputs, config, $buttonPointerCountControl } = testInstance;
    const defaultConfig = { ...config };
    const testHandler = jest.fn();
    $.each(inputs, (key) => {
      inputs[key].forEach(($input: JQuery) => {
        const tagName = $input.prop('tagName');
        if (tagName === 'LABEL') {
          const $clickTarget = $input.find('input[type=radio]');
          $clickTarget.on('click', testHandler);
          $clickTarget.click();
          expect(testHandler).toHaveBeenCalled();
          testHandler.mockRestore();
        }
        if (tagName === 'INPUT') {
          $input.on('focusout', testHandler);
          $input.focusout();
          expect(testHandler).toHaveBeenCalled();
          testHandler.mockRestore();
        }
      });
    });
    $buttonPointerCountControl.on('click', testHandler);
    $buttonPointerCountControl.click();
    expect(testHandler).toHaveBeenCalled();
    testHandler.mockRestore();
    $buttonPointerCountControl.click();
    $.each(config, (key) => {
      if (key !== 'input') {
        config[key] = defaultConfig[key];
      }
    });
    testInstance.rebuildSlider();
  });

  test('rebuildSlider()', () => {
    const {
      mainContainers, slider, config, titles,
    } = testInstance;
    const lastConfig = { ...config };
    const configKeys = Object.keys(config);
    configKeys.pop();
    const randomKey = configKeys[makeRandomNumber(0, configKeys.length - 1)];
    if (typeof (config[randomKey]) === 'boolean') {
      config[randomKey] = !config[randomKey];
    }
    if (typeof (config[randomKey]) === 'object') {
      switch (randomKey) {
        case 'range': {
          config.range = [-1000, 1000];
          break;
        }
        case 'start': {
          config.start = [50];
          break;
        }
        case 'step': {
          config.step = 5;
          break;
        }
        default: {
          break;
        }
      }
    }
    if (randomKey === 'orientation') {
      config.orientation = config.orientation === 'horizontal'
        ? 'vertical'
        : 'horizontal';
    }
    testInstance.rebuildSlider();
    expect(slider instanceof SimpleRangeSlider).toBe(true);
    expect(slider.config).toEqual(config);
    expect(slider.$container).toEqual(mainContainers.$slider);
    expect(titles.$slider.parent()).toEqual(mainContainers.$slider);
    config[randomKey] = lastConfig[randomKey];
    testInstance.rebuildSlider();
  });

  test('handleRadioClick(event)', () => {
    const { inputs, config } = testInstance;
    const defaultConfig = { ...config };
    $.each(config, (key) => {
      if (key !== 'input') {
        defaultConfig[key] = config[key];
      }
    });
    $.each(inputs, (key, input) => {
      let name = String(key).slice(1);
      input.forEach(($input: JQuery) => {
        const tagName = $input.prop('tagName');
        if (tagName === 'LABEL') {
          const $target = $input.find('input[type=radio]');
          name = $target.prop('name');
          $target.click();
          if (name === 'orientation') {
            expect(config[name]).toBe($input.text());
            expect(testInstance.isHorizontal).toBe(config.orientation === 'horizontal');
          } else {
            expect(config[name]).toBe($input.text() === 'enable');
          }
        }
      });
      config[name] = defaultConfig[name];
    });
  });

  test('handleInputFocusout(event)', () => {
    const { inputs, config } = testInstance;
    const defaultConfig: iObject = JSON.parse(JSON.stringify(config));
    [false].forEach((isClickIncreaseButton) => {
      if (isClickIncreaseButton) {
        testInstance.$buttonPointerCountControl.click();
      }
      $.each(inputs, (key, input) => {
        if (key !== '$control') {
          input.forEach(($input: JQuery) => {
            const tagName = $input.prop('tagName');
            if (tagName === 'INPUT') {
              const splitPropName = $input.prop('name').split('-');
              const name = splitPropName[0];
              const index = Number(splitPropName[1]);
              const testValue = makeRandomNumber(-10, 110);
              const lastValue = name !== 'step' ? config[name][index] : config[name];
              console.log(key, index, inputs[key][index].val());
              inputs[key][index].val(testValue);
              console.log(key, index, inputs[key][index].val());
              inputs[key][index].focusout();
              console.log(key, index, inputs[key][index].val());
              const newValue = name !== 'step' ? config[name][index] : config[name];
              switch (name) {
                case 'start': {
                  if (testInstance.isSinglePointer) {
                    const isOutOfRange = testValue < config.range[0] || testValue > config.range[1];
                    if (!isOutOfRange) {
                      expect(newValue).toBe(testValue);
                    } else {
                      expect(newValue).toBe(lastValue);
                    }
                  }
                  break;
                }
                default:
                  break;
              }
              inputs[key][index].val(name !== 'step' ? defaultConfig[name][index] : defaultConfig[name]);
              inputs[key][index].focusout();
              console.log(config);
            }
          });
        }
      });
      // $.each(config, (key) => {
      //   if (key !== 'input') {
      //     config[key] = defaultConfig[key];
      //   }
      // });
      // testInstance.rebuildSlider();
    });
  });
});
