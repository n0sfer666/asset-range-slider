class Pointer {
  private orientation: tOrientation;

  private position: number;

  private index: number;

  constructor(orientation: tOrientation, position: number, index: number) {
    this.orientation = orientation;
    this.position = position;
    this.index = index;
    console.log('pointer initiated');
  }
}

export default Pointer;
