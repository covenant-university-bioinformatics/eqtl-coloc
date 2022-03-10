import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { createWorkers } from '../workers/eqtlcoloc.main';
import { EqtlColocJobQueue } from './queue/eqtlcoloc.queue';
import { NatsModule } from '../nats/nats.module';
import { JobCompletedPublisher } from '../nats/publishers/job-completed-publisher';

@Module({
  imports: [NatsModule],
  providers: [EqtlColocJobQueue],
  exports: [EqtlColocJobQueue],
})
export class QueueModule implements OnModuleInit {
  @Inject(JobCompletedPublisher) jobCompletedPublisher: JobCompletedPublisher;
  async onModuleInit() {
    await createWorkers(this.jobCompletedPublisher);
  }
}
