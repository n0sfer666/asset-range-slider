type ConfigOrientation = 'horizontal' | 'vertical';
type ConfigRange = [number, number];
type PointerValue = [number] | [number, number];
type PointerPosition = PointerValue;
type ConfigInputs = {
  values?: JQuery[],
  $tooltip?: JQuery
};
type PointerCssValues = {
  attribute: string,
  value: string
};
type ViewData = {
  position?: number,
  value?: number,
  index: number
};
type PointerData = {
  position: number,
  index: number
};
type ScaleData = {
  value: number,
};
type InputTextData = {
  value: number,
  index: number
};
type ModelData = {
  values: number[],
  positions: number[],
  index: number
};
interface ObjectKeyString {
  [key: string]: any;
}
interface ConfigUserList extends ObjectKeyString {
  orientation?: ConfigOrientation;
  start?: PointerValue;
  range?: ConfigRange;
  step?: number;
  connect?: boolean;
  tooltip?: boolean;
  scale?: boolean;
  input?: ConfigInputs;
}
interface CompleteConfigList extends ObjectKeyString {
  orientation: ConfigOrientation;
  start: PointerValue;
  range: ConfigRange;
  step: number;
  connect: boolean;
  tooltip: boolean;
  scale: boolean;
  input?: ConfigInputs;
}
interface ConfigModelList extends ObjectKeyString {
  start: PointerValue;
  range: ConfigRange;
  step: number;
}
interface ConfigViewList extends ObjectKeyString {
  orientation: ConfigOrientation,
  start: PointerValue;
  range: ConfigRange;
  connect: boolean;
  tooltip: boolean;
  scale: boolean;
  input?: ConfigInputs;
}
interface ViewCallback {
  (viewData: ViewData): void
}
interface PointerCallback {
  (pointerData: PointerData): void
}
interface ScaleCallback {
  (scaleData: ScaleData): void
}
interface InputTextCallback {
  (inputTextData: InputTextData): void
}
interface ModelCallback {
  (modelData: ModelData): void
}
interface JQuery {
  simpleRangeSlider(config: ConfigUserList): JQuery
  getSliderConfig(): CompleteConfigList
  updateSlider(config: ConfigUserList): void
}
