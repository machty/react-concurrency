import { Task } from "../concurrency";

import UnboundedPolicy from "../concurrency/external/scheduler/policies/unbounded-policy";
import RestartablePolicy from "../concurrency/external/scheduler/policies/restartable-policy";

class TaskBuilder {
  constructor(options) {
    this.options = options;
  }

  restartable() {
    return this._clone({ policyClass: RestartablePolicy });
  }

  _clone(options) {
    return new TaskBuilder(Object.assign({}, this.options, options));
  }

  bind(instance) {
    let policyClass = this.options.policyClass || UnboundedPolicy;
    let schedulerPolicy = new policyClass(this.options.maxConcurrency);

    const options = Object.assign({
      scheduler: new EmberScheduler(schedulerPolicy, stateTrackingEnabled),
    }, this.options);

    return new Task({
      perform: this.options.perform,
      instance,
      schedulerPolicy,
    });
  }
}

export function task(options) {
  return new TaskBuilder(options);
}