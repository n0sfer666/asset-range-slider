import Presenter from '../../SimpleRangeSlider/Presenter/Presenter';
import '../../SimpleRangeSlider/SimpleRangeSliderJQ';
import { TextInputBlockEvent } from './types';
declare class TextInput {
    $mainContainer: JQuery;
    $sliderContainer: JQuery;
    sliderInstance: Presenter;
    sliderConfig: CompleteConfigList;
    inputs: JQuery[];
    configurationName: string;
    configurationValue: number | ConfigRange | PointerValue;
    constructor($container: JQuery, $sliderContainer: JQuery);
    initInputs(): void;
    handleInputFocusOut(event: TextInputBlockEvent): void;
    handleDocumentMousedown(): void;
    handleDocumentMousemove(): void;
    static handleDocumentMouseup(): void;
    updateSlider(value: number | ConfigRange | PointerValue): void;
    bindHandlers(): void;
    bindContext(): void;
    blinkInputAndReturnPreviousValue($input: JQuery, previousValue: number, index: number): void;
}
export default TextInput;
