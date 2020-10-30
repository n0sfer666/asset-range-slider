import './style/main.css';

class Main {
  constructor() {
    console.log('hello world');
  }
  sum(a: number, b: number): number {
    return a + b;
  }
}

const main = new Main();
