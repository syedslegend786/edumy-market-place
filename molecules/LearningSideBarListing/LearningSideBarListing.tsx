import React from 'react'
import { LearningSideBarItem } from '../LearningSideBarItem'
import { GetSingleLessonForLearningRTO } from '@/pages/api/course/get-single-lesson-for-learning'
import { useRouter } from 'next/router'
export const LearningSideBarListing = ({ course }: GetSingleLessonForLearningRTO) => {
    const router = useRouter()
    const { lessonid } = router.query
    return (
        <>
            {
                course?.Lesson.map((lesson, index) => (
                    <LearningSideBarItem
                        id={lesson.id}
                        index={index + 1}
                        name={course.name}
                        selected={!!lessonid && lessonid === lesson.id}
                        onClick={() => {
                            if(lesson.id!==lessonid){
                                router.push(`/course/mylearning/${course.id}/${lesson.id}`)
                            }
                        }}
                    />
                ))
            }
        </>
    )
}