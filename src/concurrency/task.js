export class Task {
  constructor({ perform, instance, scheduler }) {
    this.perform = perform;
    this.instance = instance;
    this.scheduler = scheduler;
    this.perform = (...args) => this._perform(...args);
  }

  _perform(...args) {
    // let taskInstance = new TaskInst

    this._scheduler.perform(taskInstance);


    // this.isRunning = !this.isRunning;
    // this.state = { wat: Math.random() };
    // this.fn.apply(this.instance, args);
  }
}
