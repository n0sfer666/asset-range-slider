class View {
  private container: JQuery;

  private config: iConfigView;

  constructor(container: JQuery, config: iConfigView) {
    this.container = container;
    this.config = config;
    console.log('View was initiated');
  }
}

export default View;
