import {CronCommand, CronJob} from 'cron';
import {ISchedule, ISchedulerController} from '@essential-projects/scheduler_contracts';

export abstract class BaseController implements ISchedulerController {

  public config: any = undefined;
  public jobs: Array<CronJob> = [];
  public schedule: ISchedule = {
    registerJob: (schedule: string | Date, job: CronCommand): void => {
      this.jobs.push(new CronJob(schedule, job));
    },
  };

  public initialize(): Promise<any> | any {
    return this.initializeScheduler();
  }

  public abstract initializeScheduler(): Promise<any> | any;

  /**
   * If any resources need to be disposed when the serves closes down, this
   * method can be implemented in the inheriting class.
   */
  public dispose(): Promise<void> | void { }

}
