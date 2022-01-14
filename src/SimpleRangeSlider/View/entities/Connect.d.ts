declare class Connect {
    startPosition: number;
    endPosition: number;
    orientation: ConfigOrientation;
    isSinglePointer: boolean;
    $element: JQuery;
    readonly normalizingCoefficient: number;
    constructor(startPosition: number, endPosition: number, orientation: ConfigOrientation, isSinglePointer: boolean);
    initElement(): void;
    setPosition(startPosition: number, endPosition: number, isSinglePointer?: boolean): void;
    setOrientation(orientation: ConfigOrientation): void;
}
export default Connect;
