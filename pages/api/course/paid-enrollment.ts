import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { calculatePlaterformFee, stripe, usdToCents } from "@/lib/stripe"
import { PaidEnrolmentDTO } from "@/molecules"
import { ErrorResponse, SuccessResponse } from "@/utils/apiresponses"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const session = await getServerSession(req, res, authOptions)
        const { courseId } = req.body as PaidEnrolmentDTO
        const course = await db.course.findUnique({
            where: {
                id: courseId
            },
            include: {
                user: {
                    select: {
                        stripe_account_id: true
                    }
                }
            }
        })
        if (!course) {
            return ErrorResponse({
                error: "Course does not exists.",
                res,
                status: 400
            })
        }
        if (!course.paid) {
            return ErrorResponse({
                error: "Course is not paid.",
                res,
                status: 400
            })
        }
        if (!course?.user?.stripe_account_id) {
            return ErrorResponse({
                error: "User is not a valid instructor.",
                res,
                status: 400
            })
        }
        const plateFormFee = calculatePlaterformFee(course.price)
        // create the product
        const product = await stripe.products.create({
            name: course.name,
            images: [`${course.imagePreview}`]
        });
        // create the price
        const price = await stripe.prices.create({
            unit_amount: usdToCents(course.price),
            currency: 'usd',
            product: product.id,
        });

        const stripe_session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            payment_intent_data: {
                application_fee_amount: usdToCents(plateFormFee),
                transfer_data: {
                    destination: course.user.stripe_account_id
                }
            },
            // line-items
            line_items: [
                {
                    price: price.id,
                    quantity: 1
                }
            ],
            // urls
            success_url: `${process.env.STRIPE_SUCCESS_URL}?cid=${course.id}` as string,
            cancel_url: process.env.STRIPE_CANCEL_URL as string,
            mode:"payment"
        })
        // save the stripe_session in the user
        await db.user.update({
            where: {
                id: session?.user.id
            },
            data: {
                stripe_session_id: stripe_session.id
            }
        })
        return SuccessResponse({
            res,
            data: {
                stripe_session_id: stripe_session.id
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