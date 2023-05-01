import { db } from '@/lib/db'
import { CourseLessonsList, SingleCourseJumboTron } from '@/molecules'
import { Button, Dialog } from '@/ui'
import { Course, Lesson } from '@prisma/client'
import { GetServerSideProps } from 'next'
import React, { useState } from 'react'
import ReactPlayer from 'react-player'
interface SingleCourseProp {
    course: (Course & {
        Lesson: Lesson[];
        user: {
            id: string;
            name: string | null;
        };
    }) | null
}
const SingleCourse = ({ course }: SingleCourseProp) => {
    const [hasWindow, sethasWindow] = useState(false)
    const [open, setopen] = useState(false)
    const [videoUrl, setvideoUrl] = useState("")
    React.useEffect(() => {
        if (typeof window !== "undefined") {
            sethasWindow(true)
        }
    }, [])
    return (
        <div>
            {
                course &&
                <SingleCourseJumboTron
                    onClickPreview={(video) => {
                        setvideoUrl(video)
                        setopen(true)
                    }}
                    course={course} />
            }
            {
                (course?.Lesson !== undefined && course.Lesson.length > 0) &&
                <CourseLessonsList
                    onPreviewClicked={(video) => {
                        setvideoUrl(video)
                        setopen(true)
                    }
                    }
                    lessons={course.Lesson}
                />
            }
            <Dialog title='Preview Video' open={open} onChange={(open) => { setopen(open) }} className='max-w-[50%]'>
                <div className='w-[50%] aspect-video'>
                    <ReactPlayer playing controls url={videoUrl} />
                </div>
            </Dialog>
        </div>
    )
}

export default SingleCourse

export const getServerSideProps: GetServerSideProps<SingleCourseProp> = async (ctx) => {
    const cid = ctx?.params?.cid as string
    const course = await db.course.findFirst({
        where: {
            id: cid
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true
                }
            },
            Lesson: {}
        }
    })
    return {
        props: {
            course
        }
    }
}