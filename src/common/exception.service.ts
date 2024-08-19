import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ExceptionService {
    subjectNotFound<T>(subject: string, where: T): NotFoundException {
        throw new NotFoundException(
            `${subject} with ${Object.entries(where)
                .map(([key, value]) => `${key} ${value}`)
                .join(', ')} was not found.`,
        );
    }

    somethingBadHappened(
        subject: string,
        adjective: string,
    ): InternalServerErrorException {
        throw new InternalServerErrorException(
            `Something bad happened and the ${subject} was not ${adjective}.`,
        );
    }

    emailConflict(subject: string, email: string): ConflictException {
        throw new ConflictException(
            `A ${subject} with the email ${email} is already registered.`,
        );
    }

    passwordConfirmationNotMatch(): BadRequestException {
        throw new BadRequestException(
            'Password and password confirmation do not match.',
        );
    }
}
