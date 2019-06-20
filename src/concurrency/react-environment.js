import { Environment } from "./external/environment";

const Promise = window.Promise;
const MICROTASK_PROMISE = window.Promise.resolve();

export class ReactEnvironment extends Environment {
  assert(message, test) {
    // TODO: use a more React-specific invariant?
    if (!test) {
      throw new Error(message);
    }
  }

  async(callback) {
    MICROTASK_PROMISE.then(callback);
  }

  reportUncaughtRejection(error) {
    Promise.reject(error);
  }

  defer() {
    return Promise.defer();
  }

  globalDebuggingEnabled() {
    return false;
  }
}
