import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

type User = {
  id: number;
  email: string;
  name?: string | null;
  role?: string;
  password: string; 
};

const prisma = new PrismaClient();

async function comparePasswords(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
}

async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
      },
    });

    if (!user) {
      console.log('No user found');
      return null;
    }

    const isValid = await comparePasswords(password, user.password);

    if (!isValid) {
      console.log('Invalid password');
      return null;
    }

    // delete user.password;

    return user;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

const handler =  NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        console.log(req)
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await authenticateUser(credentials.email, credentials.password);

        if (!user) {
          return null;
        }

        return {
          id: user.id.toString(), // Convert to string if it's not already
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = {
        // id: token.id,
        email: token.email,
        name: token.name,
        // role: token.role
      };

      return session;
    }
  },
  pages: {
    signIn: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET,
});
export { handler as GET, handler as POST };