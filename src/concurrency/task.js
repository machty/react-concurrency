import { TaskInstance } from "./task-instance";
import { TaskInstanceExecutor } from "./external/task-instance/executor";
import { REACT_ENVIRONMENT } from './react-environment';

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
    let executor = new TaskInstanceExecutor({
      generatorFactory: () => this.fn.apply(this.instance, args),
      env: REACT_ENVIRONMENT,
    });
    let taskInstance = new TaskInstance(this, executor);

    // if (this.context.isDestroying) {
    //   // TODO: express this in terms of lifetimes; a task linked to
    //   // a dead lifetime should immediately cancel.
    //   taskInstance.cancel();
    // }

    this.scheduler.perform(taskInstance);
    return taskInstance;
  }
}
