function getControlInput($container: JQuery): ConfigInputs {
  const $control = $container.find('.text-input-block_with-control');
  return {
    $tooltip: $control.find('.js-text-input-block__checkbox[name="tooltip"'),
    $values: Array.from($control.find('.js-text-input-block__input[name="control"]').map(
      (_, element) => $(element),
    )),
  };
}

export default getControlInput;
