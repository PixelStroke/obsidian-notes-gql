import { GraphQLError, GraphQLErrorExtensions, GraphQLErrorOptions } from 'graphql/error/GraphQLError';

export enum GraphQLErrorCode {
    INVALID_INPUT = 'INVALID_INPUT',
    USER_INPUT_ERROR = 'USER_INPUT_ERROR',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
  }

/** GraphQLError class to throw when a user input is invalid
 * @param message
 * @param extensions
 */
export class UserInputError extends GraphQLError {
    constructor(message: string, extensions: GraphQLErrorExtensions | null = {}) {
      super(message, {
        extensions: {
          ...extensions,
          code: GraphQLErrorCode.USER_INPUT_ERROR,
        },
      } as GraphQLErrorOptions);
      this.name = 'UserInputError';
    }
  }

/** GraphQLError class to throw when a validation check is invalid
 * @param message
 * @param extensions
 */
export class ValidationError extends GraphQLError {
    constructor(message: string, extensions: GraphQLErrorExtensions | null = {}) {
      super(message, {
        extensions: {
          ...extensions,
          code: GraphQLErrorCode.VALIDATION_ERROR,
        },
      } as GraphQLErrorOptions);
      this.name = 'ValidationError';
    }
  }

/** GraphQLError class to throw when an input validation check is invalid
 * @param message
 * @param extensions
 */
  export class InvalidInputError extends GraphQLError {
    constructor(message: string, extensions: GraphQLErrorExtensions = {}) {
      super(message, {
        extensions: {
          ...extensions,
          code: GraphQLErrorCode.INVALID_INPUT,
        },
      });
      this.name = 'InvalidInput';
    }
  }