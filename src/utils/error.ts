export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public hint?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown): void {
  if (error instanceof AppError) {
    console.error(`Error: ${error.message}`);
    if (error.hint) {
      console.error(`Hint: ${error.hint}`);
    }
  } else if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
  } else {
    console.error('An unknown error occurred');
  }
  process.exit(1);
}

export function createError(message: string, hint?: string): AppError {
  return new AppError(message, undefined, hint);
}

