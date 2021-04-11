type tContainer = 'main' | 'slider' | 'config';
interface iTitles extends iObject {
  $main: JQuery,
  $slider: JQuery,
  $config: JQuery,
  $control: JQuery,
  $orientation: JQuery,
  $range: JQuery,
  $start: JQuery,
  $step: JQuery,
  $scale: JQuery,
  $connect: JQuery,
  $tooltip: JQuery,
}

interface iMainContainers extends iObject {
  $main: JQuery,
  $slider: JQuery,
  $config: JQuery,
}

interface iContainers extends iObject {
  $control: JQuery,
  $orientation: JQuery,
  $range: JQuery,
  $start: JQuery,
  $step: JQuery,
  $scale: JQuery,
  $connect: JQuery,
  $tooltip: JQuery,
}

interface iInputs extends iObject {
  $control: JQuery[],
  $orientation: JQuery[],
  $range: JQuery[],
  $start: JQuery[],
  $step: JQuery[],
  $scale: JQuery[],
  $connect: JQuery[],
  $tooltip: JQuery[],
}
