'use server';

import { revalidatePath } from 'next/cache';
import prisma from '../prisma';
import { validateLinkData } from '../validators';
import { auth } from '@/auth';

export interface Link {
  id: string;
  title: string;
  url: string;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  links: Link[];
}

export async function getDropdownLinks(): Promise<Category[]> {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  const userId = session.user.id;

  try {
    const categories = await prisma.category.findMany({
      where: {
        userId: userId,
      },
      include: {
        links: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    return categories;
  } catch (error) {
    console.log('Error fetching data:', error);
    return [];
  }
}

export async function createLinkInCategory(
  prevState: unknown,
  formData: FormData,
) {
  const session = await auth();

  console.log('session user: ', session?.user.name);

  if (!session?.user?.id) {
    return { success: false, message: 'Not authenticated.' };
  }

  const userId = session.user.id;

  const categoryId = formData.get('categoryId') as string;
  const title = formData.get('title') as string;
  const url = formData.get('url') as string;

  if (!categoryId) {
  }

  const validationResult = validateLinkData(categoryId, title, url);

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.errors,
      message: validationResult.message,
    };
  }

  // Continue with database operations if validation is successful
  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId, userId: userId },
    });

    if (!category) {
      return {
        success: false,
        message: 'Category not found or not authorized.',
      };
    }

    const maxOrderLink = await prisma.link.findFirst({
      where: { categoryId },
      orderBy: { order: 'desc' },
    });

    const newOrder = maxOrderLink ? maxOrderLink.order + 1 : 1;

    await prisma.link.create({
      data: {
        title,
        url,
        order: newOrder,
        categoryId,
      },
    });

    revalidatePath('/');

    return { success: true, message: 'Link created successfully.' };
  } catch (error) {
    console.log('Error creating link:', error);
    return { success: false, message: 'Error creating link.' };
  }
}

export async function updateDropdownItem(
  prevState: unknown,
  formData: FormData,
) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: 'Not authenticated.' };
  }

  const userId = session.user.id;

  try {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const url = formData.get('url') as string;
    const categoryId = formData.get('categoryId') as string;

    const validationResult = validateLinkData(categoryId, title, url);

    if (!validationResult.success) {
      return {
        success: false,
        errors: validationResult.errors,
        message: validationResult.message,
      };
    }

    //Check if category belongs to user
    const category = await prisma.category.findUnique({
      where: { id: categoryId, userId: userId }, // Ensure category belongs to the user
    });

    if (!category) {
      return {
        success: false,
        message: 'Category not found or not authorized.',
      };
    }

    const link = await prisma.link.findUnique({
      where: { id, categoryId }, //Also make sure link is in the right category
    });

    if (!link) {
      return { success: false, message: 'Link not found.' };
    }

    await prisma.link.update({
      where: { id },
      data: { title, url },
    });

    revalidatePath('/');
    return { success: true, message: 'Link updated successfully.' };
  } catch (error) {
    console.log('Error updating data:', error);
    return { success: false, message: 'Error updating link.' };
  }
}

export async function deleteDropdownItem(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: 'Not authenticated.' };
  }

  const userId = session.user.id;

  try {
    const link = await prisma.link.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!link) {
      return { success: false, message: 'Record to delete does not exist.' };
    }

    if (link.category.userId !== userId) {
      return { success: false, message: 'Unauthorized to delete this link.' };
    }

    await prisma.link.delete({ where: { id } });
    revalidatePath('/');
    return { message: 'Link deleted successfully.' };
  } catch (error) {
    console.log('Error deleting data:', error);
    return { success: false, message: 'Failed to delete link.' };
  }
}

export const changeOrder = async (id: string, newOrder: number) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: 'Not authenticated.' };
  }

  const userId = session.user.id;

  try {
    const link = await prisma.link.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!link) {
      return { success: false, message: 'Link not found' };
    }

    if (link.category.userId !== userId) {
      return {
        success: false,
        message: 'Unauthorized to change the order of this link.',
      };
    }

    await prisma.link.update({
      where: { id },
      data: { order: newOrder },
    });
    revalidatePath('/');
  } catch (error) {
    console.log('Error updating order:', error);
    return { success: false, message: 'Error updating order.' };
  }

  revalidatePath('/');

  return { success: true, message: 'Order updated successfully.' };
};
