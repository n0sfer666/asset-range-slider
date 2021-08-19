# Simple Range Slider
 - установка: **npm run i**  
 - запуск: **npm run start**  
 - тесты: **npm run test**  
 - линтер: **npm run lint**  
 - линтер (с автофиксом) : **npm run lint:fix**
## Использование
При создании инстанса приоритетными считаются параметры из data-атрибутов
1) JS
```js
$(container).simpleRangeSlider({
  orientation: 'horizontal' | 'vertical',
  range: [leftBorder: number, rightBorder: number],
  start: [startValue: number] | [leftStartValue: number, rightStartValue: number],
  step: number,
  tooltip: boolean,
  connect: boolean,
  scale: boolean,
  input: {
    values: [leftPointer: JQuery, rightPointer: JQuery],
    $tooltip: switchCheckbox: JQuery,
  }
});
```
Пример
```js
$(container).simpleRangeSlider({
  orientation: 'horizontal',
  range: [-100, 100],
  start:[0],
  step: 1,
  tooltip: true,
  connect: true,
  scale: true,
});
```
2) HTML
index.html
```html
<div class="slider-container js-slider-container" data-orientation="horizontal" data-start="10" data-range="0,100" data-step="1" data-connect="true" data-tooltip="true" data-scale="true">
</div>
```
index.ts(.js)
```js
$('.js-slider-container').simpleRangeSlider({});
```
## Типы и интерфейсы
<details><summary>Типы</summary>
<p>

```js
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
  values: PointerValue,
  positions: PointerValue,
  index: number
};
```

</p></details>

<details><summary>Интерфесы</summary>
<p>

```js
interface ObjectKeyString {
  [key: string]: any;
}
interface UserConfigList extends ObjectKeyString {
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
interface ModelConfigList extends ObjectKeyString {
  start: PointerValue;
  range: ConfigRange;
  step: number;
}
interface ViewConfigList extends ObjectKeyString {
  orientation: ConfigOrientation,
  connect: boolean;
  tooltip: boolean;
  scale: boolean;
  input?: ConfigInputs;
}
interface ViewUpdateList extends ObjectKeyString {
  positions?: PointerValue,
  values?: PointerValue,
  range?: ConfigRange,
  orientation?: ConfigOrientation,
  connect?: boolean;
  tooltip?: boolean;
  scale?: boolean;
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
  simpleRangeSlider(config: UserConfigList): JQuery
  getSliderConfig(): JQuery
  getSliderInstance(): JQuery
  updateSlider(config: UserConfigList): JQuery
}


```

</p></details>


## Архитектура
Плагин использует архитектуру MVC.
### (M)odel
Содержит бизнес-логику, ничего не знает о других слоях.
### (V)iew (passive)
Управляет отображением плагина и взаимодействием с пользователем. Ничего не знает о других слоях.
### (C)Controller (Presenter)
Главный слой. Обеспечивает взаимодействие между **(M)** и **(V)**,. Позволяет получить актуальную версию конфигурации и обновлять слайдер.


### SimpleRangeSliderJQ
Расширяет JQuery методами:  
 - simpleRangeSlider(config)
 - getConfig()
 - updateSlider(config)
