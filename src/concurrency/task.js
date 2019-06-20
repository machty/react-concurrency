export class Task {
  constructor(instance, fn) {
    this.instance = instance;
    this.fn = fn;
    this.isRunning = false;
    this.perform = (...args) => this._perform(...args);
  }

  _perform(...args) {
    this.isRunning = !this.isRunning;
    this.state = { wat: Math.random() };
    this.fn.apply(this.instance, args);
  }
}
