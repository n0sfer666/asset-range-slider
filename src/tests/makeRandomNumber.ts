function makeRandomNumber(min: number, max: number): number {
  const tmpMin: number = Math.ceil(min);
  const tmpMax: number = Math.floor(max);
  return Math.round(Math.random() * (tmpMax - tmpMin + 1)) + tmpMin;
}

export default makeRandomNumber;
