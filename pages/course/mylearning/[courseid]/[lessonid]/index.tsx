import { UserPagesLayout } from '@/layouts'
import { LearningSideBarListing } from '@/molecules'
import { GetSingleLessonForLearningRTO } from '@/pages/api/course/get-single-lesson-for-learning'
import { axios } from '@/services/api/axios'
import { handleFrontEndResponse } from '@/utils/apiresponses'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/router'
import React from 'react'
import { useQuery } from 'react-query'
import ReactPlayer from 'react-player'
export interface SingleCourseForLearningDTO {
    courseId: string
    lessonId: string
}
const SingleCourseLearn = () => {
    const router = useRouter()
    const params = router.query
    const { lessonid, courseid } = params
    console.log("patams==>", params)
    const { isLoading, data, error } = useQuery<{
        data: GetSingleLessonForLearningRTO
    }>(["get-course-lesson",lessonid,courseid], {
        queryFn: async () => {
            const { data } = await axios.post("/course/get-single-lesson-for-learning", {
                courseId: params?.courseid,
                lessonId: params?.lessonid
            } as SingleCourseForLearningDTO)
            return data;
        },
        enabled: !!params?.courseid && !!params?.lessonid
    })
    return (
        <UserPagesLayout>
            <div>
                {
                    isLoading ?
                        <div>Loading...</div>
                        :
                        error ?
                            <div>{handleFrontEndResponse(error)}</div>
                            :
                            (data?.data.course && data.data.lesson) ?
                                < div className='grid grid-cols-10 w-full h-[85vh] '>
                                    {/* side bar */}
                                    <div className='col-span-2 border-r border-r-gray-200 '>
                                        <LearningSideBarListing course={data?.data.course} lesson={data?.data.lesson} />
                                    </div>
                                    {/* content bar */}
                                    <div className='col-span-8 relative flex items-center justify-center bg-black'>
                                        <ReactPlayer
                                            controls
                                            width={"70%"}
                                            height={"70%"}
                                            url={data.data.lesson.video}
                                        />
                                    </div>
                                </div>
                                :
                                <div>Data no found...</div>
                }
            </div>
        </UserPagesLayout >
    )
}

export default SingleCourseLearn