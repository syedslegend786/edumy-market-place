import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "@/lib/db"
import { Session } from "next-auth"


export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(db),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
            },
            async authorize(credentials, req) {
                const { email, password } = credentials as { email: string, password: string }
                const user = await db.user.findFirst({
                    where: {
                        AND: [
                            {
                                email: email,
                            },
                            {
                                password: password
                            }
                        ]
                    }
                })
                if (user) {
                    const toReturn = {
                        id: user.id, roles: user.roles, email: user.email, name: user.name, image: ""
                    } as Session["user"]
                    return toReturn;
                } else {
                    throw Error("Incorrect Credentials")
                    return null;
                }

            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET as string,
    callbacks: {
        jwt: async ({ token, user }) => {
            const dbUser = await db.user.findFirst({
                where: {
                    email: token.email
                }
            })
            if (dbUser) {
                token.id = dbUser.id
                token.name = dbUser.name
                token.email = dbUser.email
                token.roles = dbUser.roles
            } else {
                token.id = user.id
                token.name = user.name
                token.email = user.email
                token.roles = user.roles
            }
            return token
        },
        session: async ({ session, token }) => {
            if (session) {
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.roles = token.roles
            }
            return session
        }
    }
}