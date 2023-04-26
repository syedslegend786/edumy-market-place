import { User } from "next-auth"
import { JWT } from "next-auth/jwt"

type UserId = string
export type UserRoles = "instructor" | "user"
declare module "next-auth/jwt" {
    interface JWT {
        id: UserId
        roles: UserRoles[]
    }
}

declare module "next-auth" {
    interface Session {
        user: User & {
            id: UserId
            roles: UserRoles[]
        }
    }
}