// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// For testing purposes only - in real world, these would be in a secure database
const TEST_USERS = [
  {
    id: "1",
    name: "admin",
    username: "admin",
    password: "admin123" // In real world, this would be hashed
  }
];

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Simple authentication check
          const user = TEST_USERS.find(user => 
            user.username === credentials?.username && 
            user.password === credentials?.password
          );

          if (user) {
            // Return user object if credentials are valid
            return {
              id: user.id,
              name: user.name,
              email: user.username + "@example.com" // Added for session consistency
            };
          }

          // Return null if user data could not be retrieved
          return null;

        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/admin/',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "your-development-secret-key" // Make sure to set this in production
});