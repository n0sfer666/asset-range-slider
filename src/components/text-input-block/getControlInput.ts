function getControlInput($container: JQuery): ConfigInputs {
  const $control = $container.find('.js-text-input-block__input[name="control"]');
  const $values: JQuery[] = [];
  $.each($control, (_, element) => {
    $values.push($(element));
  });
  const $tooltip = $container.find('.js-text-input-block__checkbox[name="tooltip"');
  return {
    $values,
    $tooltip,
  };
}

export default getControlInput;
