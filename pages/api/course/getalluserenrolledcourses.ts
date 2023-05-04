import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { ErrorResponse, SuccessResponse } from "@/utils/apiresponses"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const session = await getServerSession(req, res, authOptions)
        if (!session) {
            return ErrorResponse({
                error: "Unauthorized",
                res,
                status: 400
            })
        }
        const enrolledCourses = await db.enrolled.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                course: {
                    select: {
                        id: true,
                        imagePreview: true,
                        name: true,
                        description: true,
                        user: {
                            select: {
                                name: true
                            }
                        },
                        Lesson: {
                            select: {
                                name: true
                            }
                        }
                    }

                }
            }
        })
        return SuccessResponse({
            res,
            data: {
                courses: enrolledCourses,
            },
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