import RadioBlock from './radio-block';

function getRadioBlocks($mainContainer: JQuery, $sliderContainer: JQuery): RadioBlock[] {
  return Array.from($mainContainer.find('.js-radio-block').map(
    (_, element) => new RadioBlock($(element), $sliderContainer),
  ));
}

export default getRadioBlocks;
