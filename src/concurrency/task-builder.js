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
    return this._clone({ onState });
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
}

export function task(options) {
  return new TaskBuilder(options);
}