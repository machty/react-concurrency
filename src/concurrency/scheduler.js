import Scheduler from './external/scheduler/scheduler';

const MICROTASK_PROMISE = window.Promise.resolve();

class ReactScheduler extends Scheduler {
  isScheduled = false;

  scheduleRefresh() {
    if (this.isScheduled) {
      return;
    }
    
    MICROTASK_PROMISE.then(() => {
      this.isScheduled = false;
      this.refresh();
    });
  }
}

export default ReactScheduler;
