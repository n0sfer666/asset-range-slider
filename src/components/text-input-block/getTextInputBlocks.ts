import '../../SimpleRangeSlider/SimpleRangeSliderJQ';
import TextInput from './text-input-block';

function getTextInputBlocks(
  $mainContainer: JQuery,
  $sliderContainer: JQuery,
  sliderConfig: CompleteConfigList,
  isSinglePointer: boolean,
): TextInput[] {
  const textInputBlocks: TextInput[] = [];
  $mainContainer.find('.js-text-input-block').each((_, element) => {
    if (!$(element).hasClass('text-input-block_isControl')) {
      textInputBlocks.push(
        new TextInput(
          $(element),
          $sliderContainer,
          sliderConfig,
          isSinglePointer,
        ),
      );
    }
  });
  return textInputBlocks;
}

export default getTextInputBlocks;
