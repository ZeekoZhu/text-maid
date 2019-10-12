export type ErrorType = 'validation' | 'auth';

export class ErrorMsg {
    constructor(public type: ErrorType, public errors: string[]) {
    }
}

export const errorMsg = (errors: string[], type: ErrorType = 'validation') => new ErrorMsg(type, errors);
