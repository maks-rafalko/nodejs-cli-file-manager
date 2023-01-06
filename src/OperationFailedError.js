export class OperationFailedError extends Error {
    constructor(message = 'Operation failed') {
        super(message);
        this.name = 'OperationFailedError';
    }
}