/// <reference types="jquery" />
declare class Scale {
    readonly valuePipsNumber: number;
    readonly emptyPipsNumber: number;
    $element: JQuery;
    range: ConfigRange;
    orientation: ConfigOrientation;
    emptyPips: JQuery[];
    valuePips: JQuery[];
    callbackList: ScaleCallback[];
    diapason: number;
    values: number[];
    emptyValues: number[];
    constructor(range: ConfigRange, orientation: ConfigOrientation);
    static getElement(elementClassName: string, modifier?: string): JQuery;
    getDiapason(): number;
    initElements(): void;
    getEmptyPips(): JQuery[];
    getValuePips(): JQuery[];
    drawPips(): void;
    updatePips(): void;
    setPipPosition($pip: JQuery, value: number): void;
    getValues(): number[];
    getEmptyValues(): number[];
    getPositionByValue(value: number): number;
    handlerValuePipClick(event: JQuery.MouseEventBase): void;
    updateScale(newRange: ConfigRange, newOrientation?: ConfigOrientation): void;
    setOrientation(orientation: ConfigOrientation): void;
    subscribeOn(callback: ScaleCallback): void;
    bindContext(): void;
    bindHandler(): void;
}
export default Scale;
