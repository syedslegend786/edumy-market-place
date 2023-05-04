import { Enrolled } from '@prisma/client';
import Image from 'next/image';
import React from 'react'
import { BsFillPlayCircleFill } from 'react-icons/bs'
export type MyListingCourseCardProps = (Enrolled & {
    course: {
        id: string;
        imagePreview: string;
        name: string;
        description: string;
        user: {
            name: string | null;
        };
        Lesson: {
            name: string;
        }[];
    };
})

export const MyListingCourseCard = ({
    course,
    courseId,
    createdAt,
    id,
    updatedAt,
    userId,
}: MyListingCourseCardProps) => {
    return (
        <div className='flex items-center justify-between bg-yellow-100 hover:bg-yellow-300 cursor-pointer pr-5 rounded-[16px] overflow-hidden'>
            <div className='flex gap-x-3 '>
                <div className='relative h-20 aspect-square  '>
                    <Image src={course.imagePreview} alt='' fill className='object-cover' />
                </div>
                <div className=''>
                    <h1 className='text-lg text-blue-700 font-semibold'>{course.name}</h1>
                    <h1 className='text-sm font-semibold'>{course.Lesson.length} Lessons</h1>
                    <h1 className='text-gray-500 font-semibold'>By {course.user.name}</h1>
                </div>
            </div>
            <BsFillPlayCircleFill size={40} className='text-blue-700' />
        </div>
    )
}