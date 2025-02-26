import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
export function formatError(error: unknown): string {
  if (error instanceof ZodError) {
    return error.errors.map(err => err.message).join('. ');
  } else if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  ) {
    const field = error.meta?.target
      ? (error.meta.target as string[])[0]
      : 'Field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return JSON.stringify(error);
  }
}
