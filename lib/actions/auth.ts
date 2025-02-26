'use server';

import prisma from '../prisma';
import { revalidatePath } from 'next/cache';
import { AuthError } from 'next-auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hash, compare } from 'bcryptjs';
import { formatError } from '@/lib/utils';
import { signIn, signOut } from '@/auth';
import { signupSchema, loginSchema } from '../zodSchemas';

export async function registerUser(prevState: unknown, formdata: FormData) {
  try {
    const validatedFields = signupSchema.safeParse({
      name: formdata.get('name') as string,
      email: formdata.get('email') as string,
      password: formdata.get('password') as string,
      confirmPassword: formdata.get('confirmPassword') as string,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: validatedFields.error.message,
      };
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedFields.data.email,
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: 'User already exists',
      };
    }

    const hashedPassword = await hash(validatedFields.data.password, 10);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...userData } = validatedFields.data;

    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    console.log('Created user: ', user);

    await signIn('credentials', {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirect: false,
    });

    revalidatePath('/');
    return { success: true, message: 'User created successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    } else if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid Credentials!' };
        default:
          return { error: 'Something went wrong!' };
      }
    }

    return { success: false, message: formatError(error) };
  }
}

export async function loginUser(prevState: unknown, formdata: FormData) {
  try {
    const validatedFields = loginSchema.safeParse({
      email: formdata.get('email') as string,
      password: formdata.get('password') as string,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: formatError(validatedFields.error),
      };
    }

    const user = await prisma.user.findUnique({
      where: { email: validatedFields.data.email },
    });

    if (!user || !user.password) {
      return { success: false, message: 'Invalid credentials' };
    }

    const passwordMatch = await compare(
      validatedFields.data.password,
      user.password,
    );

    if (!passwordMatch) {
      return { success: false, message: 'Invalid credentials' };
    }

    await signIn('credentials', {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
    });

    return { success: true, message: 'User signed in successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    } else if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid Credentials!' };
        default:
          return { error: 'Something went wrong!' };
      }
    }
    return { success: false, message: 'Invalid email or password' };
  }
}

export async function signOutUser() {
  await signOut();
}
