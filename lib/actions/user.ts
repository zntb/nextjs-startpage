'use server';

import prisma from '@/lib/prisma';
import { rpcContext, getServerActionContext } from '../request-context';

export async function deleteUser(userId: string) {
  return rpcContext.run(
    { requestId: crypto.randomUUID(), timestamp: Date.now() },
    async () => {
      const context = getServerActionContext();
      console.log(
        `[${context?.requestId}] deleteUser started for user ${userId}`,
      );

      try {
        // Delete all links associated with user's categories
        await prisma.link.deleteMany({
          where: {
            category: {
              userId: userId,
            },
          },
        });

        // Delete all categories associated with the user
        await prisma.category.deleteMany({
          where: {
            userId: userId,
          },
        });

        // Delete user accounts (OAuth accounts)
        await prisma.account.deleteMany({
          where: {
            userId: userId,
          },
        });

        // Delete user sessions
        await prisma.session.deleteMany({
          where: {
            userId: userId,
          },
        });

        // Finally, delete the user
        await prisma.user.delete({
          where: {
            id: userId,
          },
        });

        console.log(
          `[${context?.requestId}] User ${userId} and all related data deleted successfully.`,
        );
        return { success: true, message: 'User deleted successfully' };
      } catch (error) {
        console.error('Error deleting user:', error);
        return { success: false, message: 'Failed to delete user' };
      }
    },
  );
}
