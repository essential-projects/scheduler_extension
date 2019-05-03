import {IContainer, IInstanceWrapper} from 'addict-ioc';
import {CronJob} from 'cron';
import {ISchedulerController, ISchedulerExtension, schedulerDiscoveryTag} from '@essential-projects/scheduler_contracts';

export class SchedulerExtension implements ISchedulerExtension {

  public config: any = undefined;

  private container: IContainer<IInstanceWrapper<any>> = undefined;
  private schedulers: any = {};
  private jobs: Array<CronJob>

  constructor(container: IContainer<IInstanceWrapper<any>>) {
    this.container = container;
  }

  public async initialize(): Promise<void> {
    await this.initializeSchedulers();
  }

  public start(): void {
    for (const job of this.jobs) {
      job.start();
    }
  }

  public close(): void {
    for (const job of this.jobs) {
      job.stop();
    }
  }

  protected async initializeSchedulers(): Promise<void> {

    let schedulerNames: Array<string>;

    const allSchedulerNames: Array<string> = this.container.getKeysByTags(schedulerDiscoveryTag);

    this.container.validateDependencies();

    const filteredSchedulerNames: Array<string> = await this.filterSchedulers(allSchedulerNames);

    if (typeof filteredSchedulerNames === 'undefined' || filteredSchedulerNames === null) {
      schedulerNames = allSchedulerNames;
    } else {

      if (!Array.isArray(filteredSchedulerNames)) {
        throw new Error('Filtered scheduler names must be of type Array.');
      }

      schedulerNames = filteredSchedulerNames;
    }

    for (const schedulerName of schedulerNames) {
      await this.initializeScheduler(schedulerName);
    }

    const jobLists = Object.values<ISchedulerController>(this.schedulers)
      .map((scheduler: ISchedulerController): Array<CronJob> => {
        return scheduler.jobs;
      });

    this.jobs = [].concat(...jobLists);
  }

  protected async initializeScheduler(schedulerName: string): Promise<void> {

    const schedulerIsNotRegistered: boolean = !this.container.isRegistered(schedulerName);
    if (schedulerIsNotRegistered) {
      throw new Error(`There is no scheduler registered for key '${schedulerName}'`);
    }

    const schedulerInstance = await this.container.resolveAsync<ISchedulerController>(schedulerName);
    this.schedulers[schedulerName] = schedulerInstance;
  }

  protected filterSchedulers(schedulerNames: Array<string>): Promise<Array<string>> | Array<string> {
    return schedulerNames;
  }

}
