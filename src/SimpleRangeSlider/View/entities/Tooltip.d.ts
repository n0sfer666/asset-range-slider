declare class Tooltip {
    value: number;
    orientation: ConfigOrientation;
    $element: JQuery;
    constructor(value: number, orientation: ConfigOrientation);
    initElement(): void;
    setValue(value: number): void;
    setOrientation(orientation: ConfigOrientation): void;
}
export default Tooltip;
