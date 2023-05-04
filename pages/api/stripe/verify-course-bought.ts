import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { VerifyCourseBoughtDTO } from "@/pages/stripe/success"
import { ErrorResponse, SuccessResponse } from "@/utils/apiresponses"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const session = await getServerSession(req, res, authOptions)
        const user = await db.user.findUnique({ where: { id: session?.user.id } })
        if (!user || !user.stripe_session_id) {
            return ErrorResponse({
                error: "unauthorized",
                res,
                status: 400
            })
        }
        const { course_id } = req.body as VerifyCourseBoughtDTO
        const course = await db.course.findUnique({ where: { id: course_id } })
        const isAlreadyEnrolled = await db.enrolled.findFirst({
            where: {
                userId: user.id,
                courseId: course?.id
            }
        })
        if (isAlreadyEnrolled) {
            return ErrorResponse({
                error: "You are already Enrolled is this course",
                res,
                status: 400
            })
        }
        if (!course) {
            return ErrorResponse({
                error: "Course not found.",
                res,
                status: 400
            })
        }

        const stripe_session = await stripe.checkout.sessions.retrieve(user.stripe_session_id)
        if (stripe_session.payment_status === "unpaid" || stripe_session.payment_status === "no_payment_required") {
            return ErrorResponse({
                error: "Payment was not successfull try again later.",
                res,
                status: 400
            })
        }
        await db.user.update({
            where: { id: user.id },
            data: {
                stripe_session_id: {
                    unset: true
                }
            }
        })
        await db.enrolled.create({
            data: {
                courseId: course.id,
                userId: user.id,
            }
        })
        return SuccessResponse({
            res,
            data: {},
            msg: "okay",
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