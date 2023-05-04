import { UserPagesLayout } from '@/layouts'
import { axios } from '@/services/api/axios'
import { useParams } from 'next/navigation'
import React from 'react'
import { useQuery } from 'react-query'
export interface SingleCourseForLearningDTO {
    courseId: string
    lessonId: string
}
const SingleCourseLearn = () => {
    const { courseid, lessonid } = useParams()
    const { isLoading, data, error } = useQuery(["get-course-lesson"], {
        queryFn: async () => {
            const { data } = await axios.post("/course/get-single-lesson-for-learning", {
                courseId: courseid,
                lessonId: lessonid
            } as SingleCourseForLearningDTO)
            return data;
        },
        enabled: !!courseid && !!lessonid
    })
    return (
        <UserPagesLayout>
            <div>
                {
                    isLoading ?
                        <div>Loading...</div>
                        :
                        error ?
                            JSON.stringify(error)
                            :
                            JSON.stringify(data)
                }
            </div>
        </UserPagesLayout>
    )
}

export default SingleCourseLearn