import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { SingleCourseForLearningDTO } from "@/pages/course/mylearning/[courseid]/[lessonid]";
import { ErrorResponse, SuccessResponse } from "@/utils/apiresponses";
import { Course, Lesson } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export type GetSingleLessonForLearning = (Course & {
    Lesson: Lesson[];
}) | null
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { courseId, lessonId } = req.body as SingleCourseForLearningDTO
        const course = await db.course.findUnique({
            where: {
                id: courseId
            },
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