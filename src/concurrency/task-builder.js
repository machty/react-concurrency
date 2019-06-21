import { Task } from "../concurrency";
import UnboundedPolicy from "./external/scheduler/policies/unbounded-policy";
import RestartablePolicy from "./external/scheduler/policies/restartable-policy";
import EnqueuedPolicy from "./external/scheduler/policies/enqueued-policy";
import DropPolicy from "./external/scheduler/policies/drop-policy";
import KeepLatestPolicy from "./external/scheduler/policies/keep-latest-policy";
import ReactScheduler from "./react-scheduler";

class TaskBuilder {
  constructor(options) {
    this.options = options;
  }

  restartable() {
    return this._clone({ policyClass: RestartablePolicy });
  }

  enqueued() {
    return this._clone({ policyClass: EnqueuedPolicy });
  }

  drop() {
    return this._clone({ policyClass: DropPolicy });
  }

  keepLatest() {
    return this._clone({ policyClass: KeepLatestPolicy });
  }

  onState(onState) {
    return this._clone({
      onState: (state, task) => {
        if (task.context.__rcIsUnmounting__) {
          return;
        }
        onState(state, task);
      }
    });
  }

  onStateRaw(onState) {
    return this._clone({ onState });
  }

  trackState() {
    return this.onState((state, task) => {
      // Update properties on the task and trigger re-render
      Object.assign(task, state);
      task.context.setState({});
    });
  }

  _clone(options) {
    return new TaskBuilder(Object.assign({}, this.options, options));
  }

  bind(instance) {
    let policyClass = this.options.policyClass || UnboundedPolicy;
    let schedulerPolicy = new policyClass(this.options.maxConcurrency);
    let taskFn = this.options.perform;

    return new Task({
      generatorFactory: (args) => () => taskFn.apply(instance, args),
      context: instance,
      group: null,
      scheduler: new ReactScheduler(schedulerPolicy, true),
      hasEnabledEvents: false,
      onState: this.options.onState,
    });
  }

  get perform() {
    forgotBindError();
  }

  get isRunning() {
    forgotBindError();
  }
}

function forgotBindError() {
  throw new Error(`It looks like you trying to use a task, but you haven't called .bind(this) on it.`);
}

export function task(options) {
  return new TaskBuilder(options);
}