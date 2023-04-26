import { NextApiResponse } from "next";

interface IErrorResponse {
    error: string,
    status?: 500 | 400
    res: NextApiResponse
}

export const ErrorResponse = ({ error, status = 400, res }: IErrorResponse) => {
    return res.status(status).json({
        msg: error
    })
}
interface ISuccessResponse {
    msg?: string,
    data?: object,
    res: NextApiResponse
}
export const SuccessResponse = ({ data = {}, msg = "okay", res }: ISuccessResponse) => {
    return res.status(200).json({
        msg,
        data,
    })
}




export const handleFrontEndResponse = (error: any): string => {
    if (error?.response?.data?.msg) {
        return error?.response?.data?.msg
    }
    return error.message
}