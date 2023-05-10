import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { SingleCourseForLearningDTO } from "@/pages/course/mylearning/[courseid]/[lessonid]";
import { ErrorResponse, SuccessResponse } from "@/utils/apiresponses";
import { Course, Lesson } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export interface GetSingleLessonForLearningRTO {
    course: (Course & {
        Lesson: {
            id: string;
            name: string;
            description: string;
        }[];
    }) | null,
    lesson: Lesson | null
}
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { courseId, lessonId } = req.body as SingleCourseForLearningDTO
        const session = await getServerSession(req, res, authOptions)
        // check-authorization
        if (!session) return ErrorResponse({ error: "Unauthorized", res, status: 400 })
        const course = await db.course.findUnique({
            where: {
                id: courseId
            },
            include: {
                Lesson: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                }
            }
        })
        // check-not-found
        if (!course) return ErrorResponse({ error: "Course Not Found.", res, status: 400 })
        // find-single-lesson
        const lesson = await db.lesson.findUnique({
            where: {
                id: lessonId
            }
        })
        return SuccessResponse({
            res,
            data: {
                course,
                lesson
            } as GetSingleLessonForLearningRTO,
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