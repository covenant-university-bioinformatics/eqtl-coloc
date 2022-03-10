import { SandboxedJob } from 'bullmq';
import * as fs from 'fs';
import {
  EqtlColocJobsModel,
  JobStatus,
} from '../jobs/models/eqtlcoloc.jobs.model';
import { EqtlColocDoc, EqtlColocModel } from '../jobs/models/eqtlcoloc.model';
import appConfig from '../config/app.config';
import { spawnSync } from 'child_process';
import connectDB, { closeDB } from '../mongoose';
import {
  deleteFileorFolder,
  fileOrPathExists,
  writeEqtlColocFile,
} from '@cubrepgwas/pgwascommon';

function sleep(ms) {
  console.log('sleeping');
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getJobParameters(parameters: EqtlColocDoc) {
  return [
    String(parameters.GTEX8tissue),
    String(parameters.p_one),
    String(parameters.p_two),
    String(parameters.p_twelve),
    String(parameters.type),
    String(parameters.s_prop),
  ];
}

export default async (job: SandboxedJob) => {
  //executed for each job
  console.log(
    'Worker ' +
      ' processing job ' +
      JSON.stringify(job.data.jobId) +
      ' Job name: ' +
      JSON.stringify(job.data.jobName),
  );

  await connectDB();
  await sleep(2000);

  //fetch job parameters from database
  const parameters = await EqtlColocModel.findOne({
    job: job.data.jobId,
  }).exec();

  const jobParams = await EqtlColocJobsModel.findById(job.data.jobId).exec();

  //create input file and folder
  let filename;

  //extract file name
  const name = jobParams.inputFile.split(/(\\|\/)/g).pop();

  if (parameters.useTest === false) {
    filename = `/pv/analysis/${jobParams.jobUID}/input/${name}`;
  } else {
    filename = `/pv/analysis/${jobParams.jobUID}/input/test.txt`;
  }

  //write the exact columns needed by the analysis
  writeEqtlColocFile(jobParams.inputFile, filename, {
    marker_name: parameters.marker_name - 1,
    p: parameters.p_value - 1,
    beta: parameters.beta ? parameters.beta - 1 : null,
    slope_se: parameters.slope_se ? parameters.slope_se - 1 : null,
  });

  if (parameters.useTest === false) {
    deleteFileorFolder(jobParams.inputFile).then(() => {
      // console.log('deleted');
    });
  }

  //assemble job parameters
  const pathToInputFile = filename;
  const pathToOutputDir = `/pv/analysis/${job.data.jobUID}/${appConfig.appName}/output`;
  const jobParameters = getJobParameters(parameters);
  jobParameters.unshift(pathToInputFile, pathToOutputDir);

  console.log(jobParameters);
  //make output directory
  fs.mkdirSync(pathToOutputDir, { recursive: true });

  // save in mongo database
  await EqtlColocJobsModel.findByIdAndUpdate(
    job.data.jobId,
    {
      status: JobStatus.RUNNING,
      inputFile: filename,
    },
    { new: true },
  );

  await sleep(3000);
  //spawn process
  const jobSpawn = spawnSync(
    // './pipeline_scripts/pascal.sh &>/dev/null',
    './pipeline_scripts/coloc.sh',
    jobParameters,
    { maxBuffer: 1024 * 1024 * 1024 },
  );

  console.log('Spawn command log');
  console.log(jobSpawn?.stdout?.toString());
  console.log('=====================================');
  console.log('Spawn error log');
  const error_msg = jobSpawn?.stderr?.toString();
  console.log(error_msg);

  let summaryFile = true;
  let resultsFile = true;

  summaryFile = await fileOrPathExists(`${pathToOutputDir}/coloc_summary.txt`);
  resultsFile = await fileOrPathExists(`${pathToOutputDir}/coloc_results.txt`);

  const answer = summaryFile && resultsFile;

  //close database connection
  closeDB();

  if (answer) {
    return true;
  } else {
    throw new Error(error_msg || 'Job failed to successfully complete');
  }

  return true;
};
