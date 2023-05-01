import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { ErrorResponse, SuccessResponse } from "@/utils/apiresponses"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const session = await getServerSession(req, res, authOptions)
        console.log("session",session)
        if (!session) {
            return ErrorResponse({
                error: "UnAuthorized",
                res,
                status: 400
            })
        }
        const courses = await db.course.findMany({
            where: {
                userId: session.user.id
            }
        })
        return SuccessResponse({
            res,
            data: courses,
            msg: "okay"
        })
    } catch (error: any) {
        return ErrorResponse({
            error: error.message,
            res,
            status: 500
        })
    }
}
export default handler