import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
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
        const user = await db.user.findUnique({ where: { id: session.user.id } })
        if (!user) return ErrorResponse({ error: "user not found", res, status: 400 })
        const balance = await stripe.balance.retrieve({
            stripeAccount: user.stripe_account_id!
        })
        return SuccessResponse({
            res,
            data: {
                balance,
            },
            msg: "okay."
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