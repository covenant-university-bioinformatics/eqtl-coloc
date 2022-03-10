import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import * as multer from 'multer';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { JobsEqtlColocService } from '../services/jobs.eqtlcoloc.service';
import { CreateJobDto } from '../dto/create-job.dto';
import { getFileOutput } from '@cubrepgwas/pgwascommon';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../decorators/get-user.decorator';
import { GetJobsDto } from '../dto/getjobs.dto';

const storageOpts = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync('/local/datasets/temporary')) {
      fs.mkdirSync('/local/datasets/temporary', { recursive: true });
    }
    cb(null, '/local/datasets/temporary'); //destination
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '__' + file.originalname);
  },
});

@UseGuards(AuthGuard())
@Controller('api/eqtlcoloc/jobs')
export class JobsEqtlColocController {
  constructor(private readonly jobsService: JobsEqtlColocService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: storageOpts }))
  async create(
    @Body(ValidationPipe) createJobDto: CreateJobDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user,
  ) {
    //call service
    return await this.jobsService.create(createJobDto, file, user);
  }

  @Get()
  findAll(@Query(ValidationPipe) jobsDto: GetJobsDto, @GetUser() user) {
    return this.jobsService.findAll(jobsDto, user);
  }

  @Get('/test')
  test(@Param('id') id: string) {
    return {
      success: true,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser() user) {
    const job = await this.jobsService.getJobByID(id, user);

    job.user = null;
    return job;
  }

  @Get('/output/:id/:file') //file is the name saved in the database
  async getOutput(
    @Param('id') id: string,
    @Param('file') file_key: string,
    @GetUser() user,
  ) {
    const job = await this.jobsService.getJobByID(id, user);
    return getFileOutput(id, file_key, job);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser() user) {
    return this.jobsService.removeJob(id, user);
  }

  @Delete()
  async deleteMany(@Param('id') id: string, @GetUser() user) {
    return await this.jobsService.deleteManyJobs(user);
  }
}
