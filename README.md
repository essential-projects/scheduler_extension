# Scheduler Extension

This is an extension for the [@essential-projects/bootstrapper](essential-projects/bootstrapper).

## What are the goals of this project?

The goal is to provide applications that utilize the [@essential-projects/bootstrapper](essential-projects/bootstrapper).
a way to execute functions based on a schedule.

### Requirements

- Node > `10.15.0`

### Setup/Installation

Install the extension and its contracts:
```shell
npm install \
  @essential-projects/scheduler_extension \
  @essential-projects/scheduler_contracts
```

### How do I use this project?

1. Create a Scheduler Router

    ```TypeScript
    import {BaseController} from '@essential-projects/scheduler_extension';

    export class MySchedulerController extends BaseController {
      public initializeScheduler(): void {
        this.registerJobs();
      }

      private registerJobs(): void {
        this.schedule.registerJob('*/5 * * * * *', (): void => {
          console.log("I'm scheduled to run every 5 seconds!");
        });
      }
    }
    ```

2. Register that Router with the schedulerDiscoveryTag

    ```TypeScript
    import {MySchedulerController} from './my_scheduler_controller';
    import {schedulerDiscoveryTag} from '@essential-projects/scheduler_contracts';

    iocContainer.register('MySchedulerController', MySchedulerController)
      .tags(schedulerDiscoveryTag)
      .singleton();
    }
    ```

3. Register the extension to the ioc-container
    ```TypeScript
    const {registerInContainer} = await import('@essential-projects/scheduler_extension/ioc_module');
    registerInContainer(iocContainer);
    ```

When starting the bootstrapper, it will now discover the extension. The extension
will then discover the registered schedulers, register all the jobs and schedule
their execution.

### Authors/Contact information

1. [Heiko Mathes](mailto:heiko.mathes@5minds.de)
