import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { FreeEnrolmentDTO } from "@/molecules";
import { ErrorResponse, SuccessResponse } from "@/utils/apiresponses";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

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
        const { courseId } = req.body as FreeEnrolmentDTO
        const course = await db.course.findUnique({
            where: {
                id: courseId
            }
        })
        if (!course) {
            return ErrorResponse({
                error: "Course Does not exists.",
                res,
                status: 400
            })
        }
        const isAlreadyEnrolled = await db.enrolled.findFirst({
            where: {
                userId: session.user.id,
                courseId: courseId
            }
        })
        if (isAlreadyEnrolled) {
            return ErrorResponse({
                error: "You already Enrolled in this course.",
                res,
                status: 400
            })
        }
        await db.enrolled.create({
            data: {
                courseId: course.id,
                userId: session.user.id
            }
        })
        return SuccessResponse({
            res,
            data: {},
            msg: "Okay"
        })
    } catch (error: any) {
        return ErrorResponse({
            error: error.message,
            res,
            status: 500
        })
    }
}

export default handler;