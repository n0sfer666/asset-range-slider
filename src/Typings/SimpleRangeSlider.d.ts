// types
type tOrientation = 'horizontal' | 'vertical';
type tCssClasses = 'slider' | 'tumbler' | 'connect' | 'tooltip';
type tRange = [number, number];
type tValue = [number] | [number, number];
type tPosition = [number] | [number, number];
type tInputType = 'value' | 'tooltip'
type tConfigInput = {
  $value?: [JQuery] | [JQuery, JQuery],
  $tooltip?: JQuery
}
type tCssValues = {
  attribute: string,
  value: string
}
type tViewData = {
  position: number,
  value: number,
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
  value: tValue,
  position: tPosition,
  index: number
}
// interfaces
interface iConfigUser {
  readonly orientation?: tOrientation;
  readonly start?: tValue;
  readonly range?: tRange;
  readonly step?: number;
  readonly connect?: boolean;
  readonly tooltip?: boolean;
  readonly scale?: boolean;
  readonly input?: tConfigInput;
}
interface iCompleteConfig {
  readonly orientation: tOrientation;
  readonly start: tValue;
  readonly range: tRange;
  readonly step: number;
  readonly connect: boolean;
  readonly tooltip: boolean;
  readonly scale: boolean;
  readonly input?: tConfigInput;
}
interface iConfigModel {
  readonly start: tValue;
  readonly range: tRange;
  readonly step: number;
}
interface iConfigView {
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
