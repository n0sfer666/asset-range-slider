declare class Presenter {
    private view;
    private model;
    constructor($container: JQuery, config: UserConfigList);
    getConfig(): CompleteConfigList;
    updateSlider(config: UserConfigList): void;
}
export default Presenter;
