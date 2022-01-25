type ConfigOrientation = 'horizontal' | 'vertical';
type ConfigRange = [number, number];
type PointerValue = [number] | [number, number];
type PointerPosition = PointerValue;
interface SliderData extends ObjectKeyString {
  position?: number,
  positions: PointerPosition,
  value?: number,
  values: PointerValue,
  index: number,
  activePointerIndex: number
}
type ViewData = Pick<SliderData, 'position' | 'value' | 'activePointerIndex'>;
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
  withConnect?: boolean;
  withTooltip?: boolean;
  withScale?: boolean;
}
interface CompleteConfigList extends Required<UserConfigList> {
}
interface ViewUpdateList extends CompleteConfigList {
  positions: PointerPosition,
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
  simpleRangeSlider(config?: UserConfigList): JQuery
}
