import Connect from './entities/Connect';
import Pointer from './entities/Pointer';
import Scale from './entities/Scale';
import ViewEntities from './ViewEntities.type';
declare class View {
    private $container;
    private config;
    private $sliderContainer;
    private $slider;
    private positions;
    private isSinglePointer;
    private callbackList;
    private activePointerIndex;
    entities: ViewEntities;
    constructor($container: JQuery, config: CompleteConfigList, positions: PointerPosition);
    subscribeOn(callback: ViewCallback): void;
    getSliderElement(isContainer: boolean): JQuery<HTMLElement>;
    getPointer(position: number, index: number, value: number): Pointer;
    getConnect(pointers: Pointer[]): Connect;
    getScale(range: ConfigRange): Scale;
    initEntities(positions: PointerPosition, values: PointerValue, range: ConfigRange): void;
    drawSlider(): void;
    switchActivePointer(): void;
    updateByPointer(pointerData: PointerData): void;
    updateByScale(scaleData: ScaleData): void;
    updateByModel(modelData: ModelData): void;
    updateView(viewUpdateList: ViewUpdateList): void;
    updateScale(range: ConfigRange): void;
    updatePositions(positions: PointerPosition, values: PointerValue): void;
    updatePointerAndTooltip(pointerLength: number, positions: PointerPosition, values: PointerValue): void;
    updateConnect(): void;
    updateOrientation(orientation: ConfigOrientation): void;
    bindContext(): void;
}
export default View;
