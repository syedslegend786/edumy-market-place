import { Course, Enrolled } from '@prisma/client'
import Image from 'next/image'
import React, { useState } from 'react'
import { MdOutlineLanguage, MdSubtitles, MdCalendarMonth } from 'react-icons/md'
import ReactPlayer from 'react-player'
import moment from 'moment'
import { Button } from '@/ui'
import { useMutation } from 'react-query'
import { axios } from '@/services/api/axios'
import { handleFrontEndResponse } from '@/utils/apiresponses'
import { currencyFormaterClient } from '@/utils/currencyFormaterClient'
import { loadStripe } from '@stripe/stripe-js'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'
export interface FreeEnrolmentDTO {
    courseId: string
}
export interface PaidEnrolmentDTO {
    courseId: string
}
interface SingleCourseJumboTronProps {
    course: (Course & {
        Lesson: {
            video: string;
            id: string
        }[];
        Enrolled: Enrolled[];
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
        createdAt,
        Lesson,
        Enrolled
    },
    onClickPreview
}: SingleCourseJumboTronProps) => {
    const pathname = usePathname()
    const router = useRouter()
    const { data: session } = useSession()
    const freeEnrolMutaion = useMutation({
        mutationFn: (data: FreeEnrolmentDTO) => {
            return axios.post(`/course/free-enrollment`, data)
        },
        onSuccess: () => {
            alert("Enrolled Successfully!")
        },
        onError: (error: any) => {
            const err = handleFrontEndResponse(error)
            alert(err)
        }
    })
    const paidEnrollMutation = useMutation({
        mutationFn: async (data: PaidEnrolmentDTO) => {
            return axios.post(`/course/paid-enrollment`, data)
        },
        onSuccess: async (response) => {
            const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY as string)
            stripe?.redirectToCheckout({ sessionId: response.data.data.stripe_session_id })
        }
    })
    const [allowPlayer, setallowPlayer] = React.useState(false)
    React.useEffect(() => {
        if (typeof window !== "undefined") {
            setallowPlayer(true)
        }
    }, [])
    const handleEnrollPaidCourse = async () => {
        paidEnrollMutation.mutate({ courseId: id })
    }
    const handleEnrollFreeCourse = async () => {
        console.log("clicked")
        freeEnrolMutaion.mutate({ courseId: id })
    }
    const hanldeLoginToEnroll = () => {
        const from = `${pathname}`
        router.push(`/auth/login?from=${encodeURIComponent(from)}`)
    }
    return (
        <div className='min-h-[400px] bg-[#1C1D1F] flex gap-x-5 pl-28 pr-10 py-10'>
            <div className='flex-[0.7] flex  justify-center flex-col flex-shrink-0 '>
                <h1 className='font-bold text-white text-4xl'>{name}</h1>
                <p className='text-white text-xl mt-5 line-clamp-3'>{description}</p>
                <div className='mt-4 text-white text-xs'>Created by <span className='text-[#89A4F5] underline underline-offset-2'>{user.name}</span></div>
                <div className='flex items-center gap-x-3 mt-3 w-max ml-auto'>
                    <div className='flex items-center !justify-end gap-x-1'>
                        <MdCalendarMonth className='!text-white' color='white' size={20} /><span className='text-white text-xs'>{`${moment(createdAt).format("dddd MMM YYYY")}`}</span>
                    </div>
                    <div className='flex items-center gap-x-1'>
                        <MdOutlineLanguage className='!text-white' color='white' size={20} /><span className='text-white text-xs'>English</span>
                    </div>
                    <div className='flex items-center gap-x-1'>
                        <MdSubtitles className='!text-white' color='white' size={20} /><span className='text-white text-xs'>English [Auto]</span>
                    </div>
                </div>
                <h1 className=' text-2xl text-white font-bold underline underline-offset-2'>
                    {
                        paid ?
                            currencyFormaterClient({ amount: price }) :
                            "Free"
                    }
                </h1>
            </div>
            <div className='flex-[0.3] flex-col flex items-center justify-center'>
                {
                    (Lesson.length > 0 && allowPlayer) &&
                    < div className='w-[100%] aspect-video cursor-pointer' onClick={() => {
                        onClickPreview && onClickPreview(Lesson[0].video)
                    }}>
                        <ReactPlayer style={{
                            pointerEvents: "none"
                        }} playing={false} light={imagePreview} url={Lesson[0].video} width={"100%"} height={"100%"} />
                    </div>
                }
                {
                    (Lesson.length === 0) &&
                    <div className='relative  w-[100%] aspect-video'>
                        <Image src={imagePreview} alt='' fill className='object-cover' />
                    </div>
                }
                {
                    !session?.user.id ?
                        <Button onClick={hanldeLoginToEnroll} text='Login to enroll' size='medium' className='w-full mt-5' />
                        :
                        (Enrolled.length > 0 && Enrolled[0].userId === session?.user.id) ?
                            <Button onClick={() => {
                                router.push(`/course/mylearning/${id}/${Lesson[0].id}`)
                            }} text='Go to the course' size='medium' className='w-full mt-5' />
                            :
                            <Button
                                loading={freeEnrolMutaion.isLoading || paidEnrollMutation.isLoading}
                                onClick={() => {
                                    paid ?
                                        handleEnrollPaidCourse()
                                        :
                                        handleEnrollFreeCourse()
                                }}
                                size='medium' className='w-full mt-5' text='Enroll' />
                }
            </div>
        </div >
    )
}