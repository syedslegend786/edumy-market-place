import { Button } from '@/ui'
import { Lesson } from '@prisma/client'
import clsx from 'clsx'
import React from 'react'
interface SingleLessonItemProps {
  lesson: Lesson
  onClick?: () => void
  index: number
}
export const SingleLessonItem = ({
  lesson: {
    courseId, description, free_preview, id, name, video
  },
  onClick,
  index
}: SingleLessonItemProps) => {
  return (
    <div onClick={onClick} className='hover:bg-gray-300 p-2 rounded-md cursor-pointer flex items-center justify-between'>
      <div className='flex items-center gap-x-3'>
        <div
          className='h-10 w-10 bg-gray-500 text-white font-bold rounded-full flex items-center justify-center'> <span className='p-0 m-0 w-max'>
            {index + 1}
          </span>
        </div>
        <h1 className={clsx(
          "text-sm font-semibold",
          {
            "text-blue-600": free_preview
          }
        )}>{name}</h1>
      </div>
      {
        free_preview ?
          <span className='text-blue-700 font-semibold text-xm underline underline-offset-2'>Preview</span>
          :
          null
      }
    </div>
  )
}