import { TaskInstance } from "./task-instance";

export class Task {
  constructor({ perform, instance, scheduler }) {
    this.perform = perform;
    this.instance = instance;
    this.scheduler = scheduler;
    this.fn = perform;
    this.perform = (...args) => this._perform(...args);
    this.tags = { a: true };
  }

  _perform(...args) {
    let taskInstance = new TaskInstance({
      generatorFactory: () => this.fn.apply(this.instance, args),
      task: this,
      tags: this.tags,
    });

    this.scheduler.perform(taskInstance);
  }
}
