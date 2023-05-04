import { UserPagesLayout } from '@/layouts'
import { db } from '@/lib/db'
import { CourseLessonsList, SingleCourseJumboTron } from '@/molecules'
import { Button, Dialog } from '@/ui'
import { serializeJsonObject } from '@/utils/serializeJsonObject'
import { Course, Enrolled, Lesson } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import React, { useState } from 'react'
import ReactPlayer from 'react-player'
interface SingleCourseProp {
    course: (Course & {
        Lesson: Lesson[];
        Enrolled: Enrolled[];
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
        <UserPagesLayout>
            <>
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
            </>
        </UserPagesLayout>
    )
}

export default SingleCourse

export const getServerSideProps: GetServerSideProps<SingleCourseProp> = async (ctx) => {
    const session = await getSession(ctx)
    const cid = ctx?.params?.cid as string
    console.log(session?.user.id, cid)
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
            Lesson: {},
            Enrolled: {
                where: {
                    userId: session?.user.id,
                },
                take: 1
            }
        }
    })
    return {
        props: {
            course: serializeJsonObject(course)
        }
    }
}