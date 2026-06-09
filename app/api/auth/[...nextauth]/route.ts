import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '@/lib/models/User';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB();
        
        // Find user and explicitly select the password field we hid in the schema
        const user = await User.findOne({ email: credentials?.email }).select('+password');
        
        if (!user) throw new Error('Invalid email or password');

        const isPasswordMatch = await bcrypt.compare(
          credentials!.password,
          user.password
        );

        if (!isPasswordMatch) throw new Error('Invalid email or password');

        // Return the user object (minus password) to be saved in the session
        return {
          id: user._id.toString(),
          name: user.fullName,
          email: user.email,
          role: user.role, // Crucial for role-based access later
        };
      }
    })
  ],
  callbacks: {
    // Inject the user's ID and role into the JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // Make the ID and role available in the frontend session object
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login', // Tell NextAuth where our custom login page is
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };