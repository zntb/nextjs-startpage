import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  providers: [
    Google,
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const isValidPassword = await compare(
          credentials.password.toString(),
          user.password as string,
        );

        if (!isValidPassword) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') return true;

      if (!user.id) {
        return false;
      }

      const existingUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!existingUser) return false;

      // console.log('existingUser from auth.ts signin: ', existingUser);

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;

        // Check if the user exists in the DB
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email as string },
          include: { categories: true }, // Fetch user categories
        });

        // If the user has no categories, add default ones
        if (existingUser && existingUser.categories.length === 0) {
          await prisma.category.createMany({
            data: [
              { name: 'E-mail', userId: existingUser.id, order: 1 },
              { name: 'Media', userId: existingUser.id, order: 2 },
              { name: 'Social', userId: existingUser.id, order: 3 },
              { name: 'Tech', userId: existingUser.id, order: 4 },
              { name: 'Tools', userId: existingUser.id, order: 5 },
            ],
          });

          console.log(`✅ Categories added for OAuth user: ${user.email}`);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }

      return session;
    },
  },
});
