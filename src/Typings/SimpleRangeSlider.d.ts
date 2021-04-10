// types
type tOrientation = 'horizontal' | 'vertical';
type tCssClasses = 'slider' | 'tumbler' | 'connect' | 'tooltip';
type tRange = [number, number];
type tValue = [number] | [number, number];
type tPosition = tValue;
type tInputType = 'value' | 'tooltip'
type tConfigInput = {
  $value?: JQuery[],
  $tooltip?: JQuery
}
type tCssValues = {
  attribute: string,
  value: string
}
type tViewData = {
  position?: number,
  value?: number,
  index: number
}
type tPointerData = {
  position: number,
  index: number
}
type tScaleData = {
  position: number,
}
type tInputTextData = {
  value: number,
  index: number
}
type tModelData = {
  values: number[],
  positions: number[],
  index: number
}
// interfaces
interface iObject {
  [key: string]: any;
}
interface iConfigUser extends iObject {
  readonly orientation?: tOrientation;
  readonly start?: tValue;
  readonly range?: tRange;
  readonly step?: number;
  readonly connect?: boolean;
  readonly tooltip?: boolean;
  readonly scale?: boolean;
  input?: tConfigInput;
}
interface iCompleteConfig extends iObject {
  orientation: tOrientation;
  start: tValue;
  range: tRange;
  step: number;
  connect: boolean;
  tooltip: boolean;
  scale: boolean;
  input?: tConfigInput;
}
interface iConfigModel extends iObject {
  readonly start: tValue;
  readonly range: tRange;
  readonly step: number;
}
interface iConfigView extends iObject {
  readonly orientation: tOrientation,
  readonly start: tValue;
  readonly range: tRange;
  readonly connect: boolean;
  readonly tooltip: boolean;
  readonly scale: boolean;
  readonly input?: tConfigInput;
}
interface iViewCallback {
  (viewData: tViewData): void
}
interface iPointerCallback {
  (pointerData: tPointerData): void
}
interface iScaleCallback {
  (scaleData: tScaleData): void
}
interface iInputTextCallback {
  (inputTextData: tInputTextData): void
}
interface iModelCallback {
  (modelData: tModelData): void
}
