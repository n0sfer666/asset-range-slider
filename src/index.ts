function importAll(r: any) {
  r.keys().forEach(r);
}
importAll(require.context('./style', true, /\.scss/));
importAll(require.context('./components', true, /\.scss/));
importAll(require.context('./components', true, /-init\.ts/));
