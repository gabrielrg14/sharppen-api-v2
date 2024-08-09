import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDTO } from './create-book.dto';

export class UpdateBookDTO extends PartialType(CreateBookDTO) {}
