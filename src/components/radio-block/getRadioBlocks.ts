import SimpleRangeSlider from '../../SimpleRangeSlider/SimpleRangeSlider';
import RadioBlock from './radio-block';

function getRadioBlocks(
  $mainContainer: JQuery,
  sliderInstance: SimpleRangeSlider,
): RadioBlock[] {
  const radioBlocks: RadioBlock[] = [];
  $mainContainer.find('.js-radio-block').each((_, element) => {
    radioBlocks.push(
      new RadioBlock(
        $(element),
        sliderInstance,
      ),
    );
  });
  return radioBlocks;
}

export default getRadioBlocks;
