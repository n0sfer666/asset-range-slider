import RadioBlock from './radio-block';

function getRadioBlocks(
  $mainContainer: JQuery,
  $sliderContainer: JQuery,
  sliderConfig: CompleteConfigList,
): RadioBlock[] {
  const radioBlocks: RadioBlock[] = [];
  $mainContainer.find('.js-radio-block').each((_, element) => {
    radioBlocks.push(
      new RadioBlock(
        $(element),
        $sliderContainer,
        sliderConfig,
      ),
    );
  });
  return radioBlocks;
}

export default getRadioBlocks;
