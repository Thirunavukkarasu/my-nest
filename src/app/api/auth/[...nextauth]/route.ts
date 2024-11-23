import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { sql } from "@vercel/postgres";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                const { rows } = await sql`
          SELECT * FROM users WHERE email=${credentials.email}
        `;

                console.log('user', rows);
                if (!rows[0]) {
                    return null;
                }

                // const passwordMatch = await compare(credentials.password, rows[0].password);

                // if (!passwordMatch) {
                //     return null;
                // }

                return {
                    id: rows[0].id,
                    email: rows[0].email,
                    name: rows[0].name,
                };
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session?.user) {
                session.user.id = token.id;
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };

