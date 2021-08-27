function getControlInput($container: JQuery): ConfigInputs {
  const $control = $container.find('.text-input-block_with-control');
  return {
    values: Array.from($control.find('.js-text-input-block__input[name="control"]').map(
      (_, element) => $(element),
    )),
  };
}

export default getControlInput;
