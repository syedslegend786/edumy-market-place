import { InstructorLayout } from '@/layouts'
import { db } from '@/lib/db'
import { axios } from '@/services/api/axios'
import { Button } from '@/ui'
import { Course, Lesson } from '@prisma/client'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { useMutation } from 'react-query'
interface SingleCoursePageProp {
    course: (Course & {
        Lesson: Lesson[];
    }) | null
}
export interface TogglePreviewLessonDTO {
    lessongId: string
}
const SingleCoursePage = ({ course }: SingleCoursePageProp) => {
    const toggleLessonPreviewMutation = useMutation({
        mutationFn: (data: TogglePreviewLessonDTO) => {
            return axios.post('/instructor/lesson/togglepreview', data)
        },
        onSuccess: () => {
            alert("updated successfully!")
        }
    })
    console.log(course)
    const router = useRouter()
    return (
        <InstructorLayout>
            <>
                {
                    !course && <div>No course found...</div>
                }
                {
                    course &&
                    <div className='pt-5'>
                        <div className='flex items-center justify-end'>
                            <Button onClick={() => { router.push(`/instructor/lesson/create/${course.id}`) }} text='Add Lesson' className='rounded bg-blue-700 text-white p-3' />
                        </div>
                        <div className='relative mx-auto bg-blue-600 w-[100px] h-[100px] rounded-full overflow-hidden'>
                            <Image src={course?.imagePreview} className='object-cover' alt='' fill />
                        </div>
                        <div className='w-[50%] mx-auto'>
                            <h1 className='text-blue-600 font-bold text-5xl text-center'>{course.name}</h1>
                            <p className='text-center text-sm text-yellow-500'>{course.description}</p>
                        </div>
                        <div className='p-5'>
                            <h1 className='text-2xl font-bold mb-5'>{course.Lesson.length} Lessons</h1>
                            {
                                toggleLessonPreviewMutation.isLoading ? <div>Updating</div>
                                    :
                                    course?.Lesson?.map((l, li) => (
                                        <div className='bg-gray-100 p-2 rounded-md flex items-center justify-between space-x-2' key={li}>
                                            <div>
                                                <div className='h-10 w-10 bg-gray-500 text-white font-bold rounded-full flex items-center justify-center'> <span className='p-0 m-0 w-max'>{li + 1}</span></div>
                                                <h1>{l.name}</h1>
                                            </div>
                                            <div className=''>
                                                <div>
                                                    Preview: {l.free_preview ? <span className=' text-green-700 font-bold'>True</span> : <span className=' text-red-700 font-bold'>False</span>}
                                                </div>
                                                {
                                                    l.free_preview ?
                                                        <Button onClick={async () => {
                                                            toggleLessonPreviewMutation.mutate({ lessongId: l.id })
                                                        }} className='rounded bg-red-200 text-red-700 p-2' text='Remove Preview' />
                                                        :
                                                        <Button onClick={() => {
                                                            toggleLessonPreviewMutation.mutate({ lessongId: l.id })
                                                        }} className='rounded bg-green-200 text-green-700 p-2' text='Allow Preview' />
                                                }
                                            </div>
                                        </div>
                                    ))
                            }
                        </div>
                    </div>
                }
            </>
        </InstructorLayout>
    )
}

export default SingleCoursePage


export const getServerSideProps: GetServerSideProps<SingleCoursePageProp> = async (ctx) => {
    const query = ctx.query.cid as string
    const course = await db.course.findUnique({
        where: {
            id: query
        },
        include: {
            Lesson: {}
        }
    })
    return {
        props: {
            course
        }
    }
}