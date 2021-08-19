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
