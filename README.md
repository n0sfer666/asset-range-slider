# Simple Range Slider
 - установка: **npm run i**  
 - запуск: **npm run start** 
 - сборка плагина в JS: **npm run build**  
 - сборка плагина в jQuery: **npm run build:jQuery** 
 - тесты: **npm run test**  
 - линтер: **npm run lint**  
 - линтер (с автофиксом) : **npm run lint:fix**
## Использование
 - При создании инстанса приоритетными считаются параметры из data-атрибутов;
 - После создания инстанс кладется в .data('SimpleRangeSlider') контейнера;
1) JS
```js
$(container).simpleRangeSlider({
  orientation: 'horizontal' | 'vertical',
  range: [leftBorder: number, rightBorder: number],
  value: [startValue: number] | [leftStartValue: number, rightStartValue: number],
  step: number,
  withTooltip: boolean,
  withConnect: boolean,
  withScale: boolean
});
```
Пример
```js
$(container).simpleRangeSlider({
  orientation: 'horizontal',
  range: [-100, 100],
  value: [0],
  step: 1,
  withTooltip: true,
  withConnect: true,
  withScale: true,
});
```
2) HTML
index.html
```html
<div class="slider-container js-slider-container" data-orientation="horizontal" data-value="10" data-range="0,100" data-step="1" data-withConnect="true" data-withTooltip="true" data-withScale="true">
</div>
```
index.ts(.js)
```js
$('.js-slider-container').simpleRangeSlider({});
```

## Архитектура
Плагин использует архитектуру MVC.
### (M)odel
Содержит бизнес-логику, ничего не знает о других слоях.
### (V)iew (passive)
Управляет отображением плагина и взаимодействием с пользователем. Ничего не знает о других слоях.
### (C)ontroller (Presenter)
Главный слой. Обеспечивает взаимодействие между **(M)** и **(V)**. Позволяет получить актуальную версию конфигурации и обновлять слайдер.


### SimpleRangeSliderJQ
Расширяет JQuery методами:  
 - simpleRangeSlider(config?) - создаёт инстанс и возвращает jQuery-объект
 > сам инстанс находится в .data('SimpleRangeSlider')

## Типы и интерфейсы
<details><summary>Типы</summary>
<p>

```js
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
  values?: PointerValue;
  range?: ConfigRange;
  step?: number;
  withConnect?: boolean;
  withTooltip?: boolean;
  withScale?: boolean;
}
interface CompleteConfigList extends Required<UserConfigList> {
}
interface ViewUpdateList extends Omit<CompleteConfigList, 'step'> {
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
interface JQuery {
  simpleRangeSlider(config?: UserConfigList): JQuery
}
interface ViewEntities extends ObjectKeyString {
  pointers: Pointer[],
  connect?: Connect | null,
  scale?: Scale | null,
}
```

</p></details>

## UML-Диаграмма
<details><summary>диаграмма</summary>
<p>
 
 ![slider](https://user-images.githubusercontent.com/21785370/143451297-f49a587e-c458-4ff9-85ed-c9b70f69b5a2.png)

 </p></details>
