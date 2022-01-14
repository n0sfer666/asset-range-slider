/// <reference types="jquery" />
import Presenter from '../../SimpleRangeSlider/Presenter/Presenter';
import '../../SimpleRangeSlider/SimpleRangeSliderJQ';
declare class RadioBlock {
    $mainContainer: JQuery;
    $sliderContainer: JQuery;
    sliderInstance: Presenter;
    configurationName: string;
    configurationValue: boolean | string;
    radioBlocks: JQuery[];
    constructor($container: JQuery, $sliderContainer: JQuery);
    getRadioBlocks(): JQuery[];
    handleRadioClick(event: JQuery.MouseEventBase): void;
    getText($radio: JQuery): string | boolean;
    bindContext(): void;
    bindHandlers(): void;
}
export default RadioBlock;
