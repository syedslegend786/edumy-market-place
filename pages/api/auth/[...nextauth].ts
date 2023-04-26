import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "@/lib/db"
import { Session } from "next-auth"
import { authOptions } from "@/lib/auth"


export default NextAuth(authOptions)