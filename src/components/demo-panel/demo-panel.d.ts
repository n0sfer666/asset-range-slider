import '../../SimpleRangeSlider/SimpleRangeSliderJQ';
import ControlButton from '../control-button/control-button';
import RadioBlock from '../radio-block/radio-block';
import TextInput from '../text-input-block/text-input-block';
declare class DemoPanel {
    $mainContainer: JQuery;
    $sliderContainer: JQuery;
    $configContainer: JQuery;
    textInputBlocks: TextInput[];
    radioBlocks: RadioBlock[];
    controlButton: ControlButton;
    constructor($container: JQuery);
    getContainer(type: 'slider-container' | 'config'): JQuery;
    getSecondValue(): JQuery;
    initContainers(): void;
    initBlocks(): void;
}
export default DemoPanel;
