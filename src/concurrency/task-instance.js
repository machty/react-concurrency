import { ReactEnvironment } from './react-environment';
import { INITIAL_STATE } from './external/task-instance/initial-state'
import { yieldableSymbol } from './external/yieldables'
import { TaskInstanceState, PERFORM_TYPE_DEFAULT } from './external/task-instance/state';
import { CancelRequest, CANCEL_KIND_EXPLICIT } from './external/task-instance/cancel-request';
import { ReactTaskInstanceDelegate } from './react-task-instance-delegate';

const EXPLICIT_CANCEL_REASON = ".cancel() was explicitly called";
const REACT_ENVIRONMENT = new ReactEnvironment();

export class TaskInstance {
  constructor({ generatorFactory, task, tags }) {
    this.task = task;
    this.tags = tags;
    this._state = new TaskInstanceState({
      generatorFactory,
      delegate: new ReactTaskInstanceDelegate(this),
      env: REACT_ENVIRONMENT,
      performType: PERFORM_TYPE_DEFAULT,
    });
  }

  _start() {
    this._state.start();
    return this;
  }

  /**
   * Cancels the task instance. Has no effect if the task instance has
   * already been canceled or has already finished running.
   *
   * @method cancel
   * @memberof TaskInstance
   * @instance
   */
  cancel(cancelReason = EXPLICIT_CANCEL_REASON) {
    this._state.cancel(new CancelRequest(CANCEL_KIND_EXPLICIT, cancelReason));
  }

  /**
   * Returns a promise that resolves with the value returned
   * from the task's (generator) function, or rejects with
   * either the exception thrown from the task function, or
   * an error with a `.name` property with value `"TaskCancelation"`.
   *
   * @method then
   * @memberof TaskInstance
   * @instance
   * @return {Promise}
   */
  then(...args) {
    return this._state.promise().then(...args);
  }

  /**
   * @method catch
   * @memberof TaskInstance
   * @instance
   * @return {Promise}
   */
  catch(...args) {
    return this._state.promise().catch(...args);
  }

  /**
   * @method finally
   * @memberof TaskInstance
   * @instance
   * @return {Promise}
   */
  finally(...args) {
    return this._state.promise().finally(...args);
  }

  _onFinalize(callback) {
    this._state.onFinalize(callback);
  }

  // this is the "public" API for how yieldables resume TaskInstances;
  // this should probably be cleanup / generalized, but until then,
  // we can't change the name.
  proceed(index, yieldResumeType, value) {
    this._state.proceedChecked(index, yieldResumeType, value);
  }

  [yieldableSymbol](parentTaskInstance, resumeIndex) {
    return this._state.onYielded(parentTaskInstance._state, resumeIndex);
  }
}

export default TaskInstance;
