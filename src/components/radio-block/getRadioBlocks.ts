import RadioBlock from './radio-block';

function getRadioBlocks(
  $mainContainer: JQuery,
  $sliderContainer: JQuery,
  sliderConfig: CompleteConfigList,
): RadioBlock[] {
  return Array.from($mainContainer.find('.js-radio-block').map((_, element) => new RadioBlock(
    $(element),
    $sliderContainer,
    sliderConfig,
  )));
}

export default getRadioBlocks;
