import { PartialType } from '@nestjs/mapped-types';
import { CreateRoutineDTO } from './create-routine.dto';

export class UpdateRoutineDTO extends PartialType(CreateRoutineDTO) {}
