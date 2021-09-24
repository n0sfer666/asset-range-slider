type ConfigOrientation = 'horizontal' | 'vertical';
type ConfigRange = [number, number];
type PointerValue = [number] | [number, number];
type PointerPosition = PointerValue;
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
}
interface CompleteConfigList extends Required<UserConfigList> {
}
interface ViewUpdateList extends UserConfigList {
  positions?: PointerValue,
  values: PointerValue,
  range: ConfigRange,
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface JQuery {
  simpleRangeSlider(config: UserConfigList): JQuery
}
