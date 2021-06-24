import SimpleRangeSlider from '../../SimpleRangeSlider/SimpleRangeSlider';
import TextInput from './text-input-block';

function getTextInputBlocks(
  $mainContainer: JQuery,
  sliderInstance: SimpleRangeSlider,
  isSinglePointer: boolean,
): TextInput[] {
  const textInputBlocks: TextInput[] = [];
  $mainContainer.find('.js-text-input-block').each((_, element) => {
    if (!$(element).hasClass('text-input-block_isControl')) {
      textInputBlocks.push(
        new TextInput(
          $(element),
          sliderInstance,
          isSinglePointer,
        ),
      );
    }
  });
  return textInputBlocks;
}

export default getTextInputBlocks;
