import { Lesson } from '@prisma/client'
import React from 'react'
import { SingleLessonItem } from '../SingleLessonItem'
interface CourseLessonsListProps {
    lessons: Lesson[]
    onPreviewClicked?: (video: string) => void
}
export const CourseLessonsList = ({ lessons, onPreviewClicked }: CourseLessonsListProps) => {
    const onClickItem = (video: string) => {
        onPreviewClicked && onPreviewClicked(video)
    }
    return (
        <div className='space-y-2  p-2'>
            <h1 className='font-bold text-xl'>{lessons.length} Lessons</h1>
            {
                lessons.map((l, li) => (
                    <SingleLessonItem onClick={() => {
                        if(l.free_preview){
                            onClickItem(l.video)
                        }
                    }
                    } index={li} lesson={l} key={li} />
                ))
            }
        </div>
    )
}