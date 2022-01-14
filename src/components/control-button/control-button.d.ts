import Presenter from '../../SimpleRangeSlider/Presenter/Presenter';
declare class ControlButton {
    $container: JQuery;
    $secondValue: JQuery;
    $sliderContainer: JQuery;
    $text: JQuery;
    sliderInstance: Presenter;
    sliderConfig: CompleteConfigList;
    isSinglePointer: boolean;
    constructor($container: JQuery, $secondValue: JQuery, $sliderContainer: JQuery);
    initText(): void;
    handleButtonClick(): void;
    addPointerIfPossible(): void;
    removePointer(): void;
    bindContext(): void;
    bindHandlers(): void;
}
export default ControlButton;
