import React from 'react'
import { Course } from '@prisma/client'
import Image from 'next/image'
import { useRouter } from 'next/router'
interface CourseCardProps extends Course {

}
export const CourseCard = ({ category, description, id, imagePreview, name, paid, price, userId }: CourseCardProps) => {
    const router = useRouter()
    return (
        <div onClick={() => { router.push(`/instructor/course/${id}`) }} className='cursor-pointer relative border p-2 shadow-md rounded-[16px] flex items-center gap-x-4'>
            <div className='relative w-[100px] h-[100px] overflow-hidden'>
                <Image quality={100} src={imagePreview} alt='' className='object-contain' fill />
            </div>
            <div>
                <h1 className='text-blue-700 text-xl font-bold'>{name}</h1>
                <p>{description}</p>
                <h1>type:{paid}</h1>
                <h1>price: {price}</h1>
                <h1>category:{category}</h1>
            </div>
        </div>
    )
}