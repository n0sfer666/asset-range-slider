/// <reference types="jquery" />
import Tooltip from './Tooltip';
declare class Pointer {
    readonly normalizingCoefficient: number;
    $container: JQuery;
    orientation: ConfigOrientation;
    position: number;
    index: number;
    withTooltip: boolean;
    tooltip?: Tooltip | null;
    $element: JQuery;
    callbackList: PointerCallback[];
    shift: number;
    boundingClientRect: number;
    containerOffsetSize: number;
    constructor($container: JQuery, orientation: ConfigOrientation, position: number, index: number, withTooltip: boolean, value: number);
    initElement(): void;
    initTooltip(value: number): void;
    updateTooltip(withTooltip: boolean, value: number): void;
    setPositionAndUpdateTooltip(position: number, withTooltip: boolean, value: number): void;
    switchActive(isActive: boolean): void;
    subscribeOn(callback: PointerCallback): void;
    setPosition(position: number): void;
    getShift(event: JQuery.MouseEventBase): number;
    getNormalizePosition(position: number): number;
    setOrientation(orientation: ConfigOrientation): void;
    handlePointerMouseDown(event: JQuery.MouseEventBase): void;
    handlePointerMove(event: JQuery.MouseEventBase): void;
    handlePointerMouseUp(): void;
    bindContext(): void;
    bindHandler(): void;
}
export default Pointer;
