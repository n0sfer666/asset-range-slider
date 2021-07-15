import ControlButton from './control-button';

function getControlButton(
  $mainContainer: JQuery,
  $secondStart: JQuery,
  $sliderContainer: JQuery,
): ControlButton {
  return new ControlButton(
    $mainContainer.find('.js-control-button'),
    $secondStart,
    $sliderContainer,
  );
}

export default getControlButton;
