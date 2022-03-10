import { Global, Module } from '@nestjs/common';
import { JobsEqtlColocService } from './services/jobs.eqtlcoloc.service';
import { JobsEqtlColocController } from './controllers/jobs.eqtlcoloc.controller';
import { QueueModule } from '../jobqueue/queue.module';
import { JobsEqtlColocNoAuthController } from './controllers/jobs.eqtlcoloc.noauth.controller';

@Global()
@Module({
  imports: [QueueModule],
  controllers: [JobsEqtlColocController, JobsEqtlColocNoAuthController],
  providers: [JobsEqtlColocService],
  exports: [],
})
export class JobsModule {}
