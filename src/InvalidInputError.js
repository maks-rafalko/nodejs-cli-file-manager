export class InvalidInputError extends Error {
    constructor(message = 'Invalid input') {
        super(message);
        this.name = 'InvalidInputError';
    }
}