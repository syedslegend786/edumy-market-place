import { ErrorResponse, SuccessResponse } from "@/utils/apiresponses";
import { NextApiRequest, NextApiResponse } from "next";
import { Lesson } from '@prisma/client'
import { TogglePreviewLessonDTO } from "@/pages/instructor/course/[cid]";
import { db } from "@/lib/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        const { lessongId } = req.body as TogglePreviewLessonDTO
        const lesson = await db.lesson.findUnique({ where: { id: lessongId } })
        await db.lesson.update({
            where: {
                id: lessongId
            },
            data: {
                free_preview: !lesson?.free_preview
            }
        })
        return SuccessResponse({
            res,
            data: {},
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

export default handler;