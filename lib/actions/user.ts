import prisma from '@/lib/prisma';

async function deleteUser(userId: string) {
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

    console.log(`User ${userId} and all related data deleted successfully.`);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
}

deleteUser('67bef9b6d7cfdf013a72916c');
