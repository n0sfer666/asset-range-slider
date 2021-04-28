import DemoPanel from '../../DemoPanel/DemoPanel';
import Panel from '../../DemoPanel/entity/Panel';

describe('DemoPanel.ts', () => {
  const $testContainer = $(document.createElement('div'));
  $(document.body).append($testContainer);
  const testInstance = new DemoPanel($testContainer);

  test('getDefaultConfig()', () => {
    const expectConfig: iCompleteConfig = {
      orientation: 'horizontal',
      start: [10],
      range: [0, 100],
      step: 10,
      connect: true,
      tooltip: true,
      scale: true,
    };
    expect(expectConfig).toEqual(testInstance.getDefaultConfig());
  });

  test('panel instanceof Panel', () => {
    expect(testInstance.panel instanceof Panel).toBe(true);
  });

  test('setPanel()', () => {
    expect($testContainer.find(testInstance.panel.mainContainers.$main).length).toBe(1);
  });
});
