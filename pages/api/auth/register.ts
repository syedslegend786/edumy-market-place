import { db } from "@/lib/db";
import { RegisterDTO } from "@/services/api/auth";
import { ErrorResponse, SuccessResponse } from "@/utils/apiresponses";
import { NextApiRequest, NextApiResponse } from "next";
import { UserRoles } from '@/types/next-auth'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { email, name, password } = req.body as RegisterDTO
        const user = await db.user.findFirst({
            where: {
                email,
            }
        })
        if (user) {
            return ErrorResponse({ error: "User Already Exits", res, status: 400 })
        }
        await db.user.create({
            data: {
                email, name, password, roles: ["user",] as UserRoles[]
            }
        })
        return SuccessResponse({ res })
    } catch (error: any) {
        return ErrorResponse({ error: error.message, res, status: 500 })
    }
}
export default handler;