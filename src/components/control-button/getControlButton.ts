import SimpleRangeSlider from '../../SimpleRangeSlider/SimpleRangeSlider';
import ControlButton from './control-button';

function getControlButton(
  $mainContainer: JQuery,
  $secondStart: JQuery,
  sliderInstance: SimpleRangeSlider,
): ControlButton {
  return new ControlButton(
    $mainContainer.find('.js-control-button'),
    $secondStart,
    sliderInstance,
  );
}

export default getControlButton;
