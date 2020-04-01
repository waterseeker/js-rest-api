export const HttpErrorResponse = {
  type: 'object',
  properties: {
    statusCode: {
      type: 'number',
      example: 400,
    },
    error: {
      type: 'string',
      example: 'Bad Request',
    },
    message: {
      type: 'array',
      items: {
        type: 'string',
      },
      example: ['parameterA must be longer than or equal to 1 characters'],
    },
  },
  required: ['statusCode', 'error'],
};
