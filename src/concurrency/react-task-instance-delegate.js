import { TaskInstanceDelegate } from "./external/task-instance/delegate";

export class ReactTaskInstanceDelegate extends TaskInstanceDelegate {
  constructor(taskInstance) {
    super();
    this.taskInstance = taskInstance;
  }

  setState(state) {
    this.taskInstance.task.instance.setState(state);
  }

  onStarted() {
    this.triggerEvent("started", this.taskInstance);
  }

  onSuccess() {
    this.triggerEvent("succeeded", this.taskInstance);
  }

  onError(error) {
    this.triggerEvent("errored", this.taskInstance, error);
  }

  onCancel(cancelReason) {
    this.triggerEvent("canceled", this.taskInstance, cancelReason);
  }

  getYieldContext() {
    return this.taskInstance;
  }

  triggerEvent(...allArgs) {
    return;

    /*
    if (!this.taskInstance._hasEnabledEvents) {
      return;
    }

    let taskInstance = this.taskInstance;
    let task = taskInstance.task;
    let host = task.context;
    let eventNamespace = task && task._propertyName;

    if (host && host.trigger && eventNamespace) {
      let [eventType, ...args] = allArgs;
      host.trigger(`${eventNamespace}:${eventType}`, ...args);
    }
    */
  }

  formatCancelReason(reason) {
    return `TaskInstance '${this.getName()}' was canceled because ${reason}`;
  }

  getName() {
    return "TODOTaskInstance.getName()";
  }

  selfCancelLoopWarning(parent) {
  }
}
