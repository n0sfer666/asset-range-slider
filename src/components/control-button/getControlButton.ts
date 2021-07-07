import ControlButton from './control-button';

function getControlButton(
  $mainContainer: JQuery,
  $secondStart: JQuery,
  $sliderContainer: JQuery,
  sliderConfig: CompleteConfigList,
  isSinglePointer: boolean,
): ControlButton {
  return new ControlButton(
    $mainContainer.find('.js-control-button'),
    $secondStart,
    $sliderContainer,
    sliderConfig,
    isSinglePointer,
  );
}

export default getControlButton;
