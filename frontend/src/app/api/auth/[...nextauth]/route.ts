import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/login`, {
            email: credentials?.email,
            password: credentials?.password,
          });

          if (res.data.status === "success" && res.data.user) {
            return {
                ...res.data.user,
                accessToken: res.data.token
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/google-login`, {
            token: account.id_token,
          });
          if (res.data.status === "success") {
            user.id = res.data.user.id;
            (user as any).accessToken = res.data.token;
            return true;
          }
          return false;
        } catch (error) {
          console.error("Google login error", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id;
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "next-auth-secret-key",
});

export { handler as GET, handler as POST };
