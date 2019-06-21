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
    return this._clone({ policy: RestartablePolicy });
  }

  enqueued() {
    return this._clone({ policy: EnqueuedPolicy });
  }

  drop() {
    return this._clone({ policy: DropPolicy });
  }

  keepLatest() {
    return this._clone({ policy: KeepLatestPolicy });
  }

  onState(onState) {
    return this._clone({
      onState: whenMounted(onState)
    });
  }

  onStateRaw(onState) {
    return this._clone({ onState });
  }

  trackState() {
    return this._clone({ trackState: true });
  }

  _clone(options) {
    return new TaskBuilder(Object.assign({}, this.options, options));
  }

  bind(instance) {
    let Policy = this.options.policy || UnboundedPolicy;
    let schedulerPolicy = new Policy(this.options.maxConcurrency);
    let taskFn = this.options.perform;
    let onState = this.options.trackState ?
      whenMounted(updateTaskAndReRender) :
      this.options.onState;

    return new Task({
      generatorFactory: (args) => () => taskFn.apply(instance, args),
      context: instance,
      group: null,
      scheduler: new ReactScheduler(schedulerPolicy, true),
      hasEnabledEvents: false,
      onState,
    });
  }

  get perform() {
    forgotBindError();
  }

  get isRunning() {
    forgotBindError();
  }
}

function whenMounted(callback) {
  return (state, task) => {
    if (task.context.__rcIsUnmounting__) {
      return;
    }
    callback(state, task);
  };
}

function forgotBindError() {
  throw new Error(`It looks like you trying to use a task, but you haven't called .bind(this) on it.`);
}

function updateTaskAndReRender(state, task) {
  Object.assign(task, state);
  task.context.setState({});
}

export function task(options) {
  return new TaskBuilder(options);
}