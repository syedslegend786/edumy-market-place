import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { ErrorResponse, SuccessResponse } from "@/utils/apiresponses"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"

const hanlder = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const session = await getServerSession(req, res, authOptions)
        if (!session) {
            return ErrorResponse({ error: "UnAuthorized", res, status: 400 })
        }
        const user = await db.user.findFirst({ where: { id: session.user.id } })
        if (!user?.stripe_account_id) return ErrorResponse({ error: "Unauthorized.", res, status: 400 })
        const account = await stripe.accounts.retrieve(
            user?.stripe_account_id
        );
        if (!account.charges_enabled) {
            return ErrorResponse({ error: "UnAuthorized", res, status: 400 })
        }
        return SuccessResponse({ res, data: {}, msg: "okay." })
    } catch (error: any) {
        return ErrorResponse({ error: error.message, res, status: 500 })
    }
}


export default hanlder;