import { Course } from '@prisma/client'
import Image from 'next/image'
import React, { useState } from 'react'
import { MdOutlineLanguage, MdSubtitles } from 'react-icons/md'
import ReactPlayer from 'react-player'
interface SingleCourseJumboTronProps {
    course: (Course & {
        Lesson: {
            video: string;
        }[];
        user: {
            id: string;
            name: string | null;
        };
    })

    onClickPreview?: (video: string) => void
}
export const SingleCourseJumboTron = ({
    course: {
        category,
        description,
        id,
        imagePreview,
        name,
        paid,
        price,
        userId,
        user,
        Lesson
    },
    onClickPreview
}: SingleCourseJumboTronProps) => {
    const [allowPlayer, setallowPlayer] = React.useState(false)
    React.useEffect(() => {
        if (typeof window !== "undefined") {
            setallowPlayer(true)
        }
    }, [])
    return (
        <div className='min-h-[400px] bg-[#1C1D1F] flex gap-x-5 pl-28 pr-10 py-10'>
            <div className='flex-[0.7] flex  justify-center flex-col flex-shrink-0 '>
                <h1 className='font-bold text-white text-4xl'>{name}</h1>
                <p className='text-white text-xl mt-5 line-clamp-3'>{description}</p>
                <div className='mt-4 text-white text-xs'>Created by <span className='text-[#89A4F5] underline underline-offset-2'>{user.name}</span></div>
                <div className='flex items-center gap-x-3 mt-3'>
                    <div className='flex items-center gap-x-1'>
                        <MdOutlineLanguage className='!text-white' color='white' size={20} /><span className='text-white text-xs'>English</span>
                    </div>
                    <div className='flex items-center gap-x-1'>
                        <MdSubtitles className='!text-white' color='white' size={20} /><span className='text-white text-xs'>English [Auto]</span>
                    </div>
                </div>
            </div>
            <div className='flex-[0.3] float-right flex items-center justify-center'>
                {
                    (Lesson.length > 0 && allowPlayer) &&
                    < div className='w-[100%] aspect-video cursor-pointer' onClick={() => {
                        onClickPreview && onClickPreview(Lesson[0].video)
                    }}>
                        <ReactPlayer style={{
                            pointerEvents: "none"
                        }} playing={false} light={imagePreview} url={Lesson[0].video} width={"100%"} height={"100%"} />
                    </div>
                }{
                    (Lesson.length === 0) &&
                    <div className='relative  w-[100%] aspect-video'>
                        <Image src={imagePreview} alt='' fill className='object-cover' />
                    </div>
                }
            </div>
        </div >
    )
}