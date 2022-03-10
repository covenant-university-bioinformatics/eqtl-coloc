import {
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsBooleanString,
} from 'class-validator';
import { AnalysisType, TISSUEOptions } from '../models/eqtlcoloc.model';

export class CreateJobDto {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  job_name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsBooleanString()
  useTest: string;

  @IsNumberString()
  marker_name: string;

  @IsNumberString()
  @IsOptional()
  beta: string;

  @IsNumberString()
  @IsOptional()
  slope_se: string;

  @IsNumberString()
  p_value: string;

  @IsNotEmpty()
  @IsEnum(TISSUEOptions)
  GTEX8tissue: TISSUEOptions;

  @IsNumberString()
  p_one: string;

  @IsNumberString()
  p_two: string;

  @IsNumberString()
  p_twelve: string;

  @IsNotEmpty()
  @IsEnum(AnalysisType)
  type: AnalysisType;

  @IsNumberString()
  s_prop: string;
}
