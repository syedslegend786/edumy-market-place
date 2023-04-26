import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ErrorResponse, SuccessResponse } from "@/utils/apiresponses";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import queryString from "query-string";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const session = await getServerSession(req, res, authOptions)
        if (!session) {
            return ErrorResponse({ error: "Unauthorized", res, status: 400 })
        }

        let user = await db.user.findFirst({ where: { id: session.user.id } })
        if (user && !user?.stripe_account_id) {
            const account = await stripe.accounts.create({ type: "express" })
            user = await db.user.update({ where: { id: user.id }, data: { stripe_account_id: account.id } })
        }
        if (!user?.stripe_account_id) {
            return ErrorResponse({ error: "Something went wrong", res, status: 400 })
        }

        const accountLink = await stripe.accountLinks.create({
            account: user.stripe_account_id,
            refresh_url: process.env.STRIPE_CREATE_INSTRUCTOR_REDIRECT_URL as string,
            type: "account_onboarding",
            return_url: process.env.STRIPE_CREATE_INSTRUCTOR_REDIRECT_URL as string,
        })
        const url = `${accountLink.url}?${queryString.stringify(accountLink)}`
        return SuccessResponse({
            res,
            data: {
                url,
            },
            msg: ""
        })
    } catch (error: any) {
        return ErrorResponse({ error: error.message, res, status: 500 })
    }
}
export default handler;