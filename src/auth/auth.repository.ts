import { AuthDTO, AuthTokenDTO } from './dto';

export abstract class AuthRepository {
    abstract authenticate(authData: AuthDTO): Promise<AuthTokenDTO>;
}
