type ConfigOrientation = 'horizontal' | 'vertical';
type ConfigRange = [number, number];
type PointerValue = [number] | [number, number];
type PointerPosition = PointerValue;
type ConfigInputs = {
  values?: JQuery[],
};
type PointerCssValues = {
  attribute: string,
  value: string
};
interface SliderData extends ObjectKeyString {
  position?: number,
  positions: PointerPosition,
  value?: number,
  values: PointerValue,
  index: number
}
type ViewData = Pick<SliderData, 'position' | 'value' | 'index'>;
type PointerData = Required<Pick<SliderData, 'position' | 'index'>>;
type ScaleData = Required<Pick<SliderData, 'value'>>;
type InputTextData = Required<Pick<SliderData, 'value' | 'index'>>;
type ModelData = Pick<SliderData, 'positions' | 'values' | 'index'>;
interface ObjectKeyString {
  [key: string]: any;
}
interface UserConfigList extends ObjectKeyString {
  orientation?: ConfigOrientation;
  values?: PointerValue;
  range?: ConfigRange;
  step?: number;
  connect?: boolean;
  tooltip?: boolean;
  scale?: boolean;
  input?: ConfigInputs;
}
interface CompleteConfigList extends Required<UserConfigList> {
}
interface ViewConfigList extends Pick<CompleteConfigList, 'orientation' | 'connect' | 'tooltip' | 'scale' | 'input'> {
}
interface ViewUpdateList extends Partial<ViewConfigList> {
  positions?: PointerValue,
  values?: PointerValue,
  range?: ConfigRange,
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
  simpleRangeSlider(config: UserConfigList): JQuery
}
