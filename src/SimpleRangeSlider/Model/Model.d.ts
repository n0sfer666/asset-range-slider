declare class Model {
    private readonly normalizingCoefficient;
    private readonly defaultConfig;
    private config;
    private callbackList;
    private positions;
    private isSinglePointer;
    constructor(config: UserConfigList);
    getPosition(): PointerPosition;
    getVerifiedConfig(userConfig: CompleteConfigList): CompleteConfigList;
    getConfig(): CompleteConfigList;
    subscribeOn(callback: ModelCallback): void;
    getPositionFromValue(value: number): number;
    getValueFromPosition(position: number): number;
    getNewValue(viewData: ViewData): number;
    setValueAndPosition(newValue: number, index: number): void;
    updateByView(viewData: ViewData): void;
    getViewUpdateList(config: UserConfigList): ViewUpdateList;
}
export default Model;
