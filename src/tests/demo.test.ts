import TestClass from '../TestClasses/TestClass';

test('test', () => {
  const testInst = new TestClass();
  expect(testInst.testMethodSum(1, 2)).toBe(3);
});
