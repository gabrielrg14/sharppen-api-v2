import { Request } from 'express';

export class RequestTokenDTO extends Request {
    token: {
        sub: string;
        iat: number;
        exp: number;
    };
}
