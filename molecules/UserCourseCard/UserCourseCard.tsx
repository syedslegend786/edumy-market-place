import React from 'react'
import { Course } from '@prisma/client'
import Image from 'next/image'
import { currencyFormaterClient } from '@/utils/currencyFormaterClient'
import { Badge } from '@/ui'
import Link from 'next/link'
import { useRouter } from 'next/router'
interface UserCourseCardProps extends Course {

}
export const UserCourseCard = ({
  category, description, id, imagePreview, name, paid, price, userId
}: UserCourseCardProps) => {
  const router = useRouter()
  return (
    <div onClick={() => { router.push(`/course/${id}`) }} className='border shadow-md cursor-pointer'>
      <div className='h-40 relative overflow-hidden border border-gray-600'>
        <Image src={imagePreview} alt='' fill className='object-cover' />
      </div>
      <div className='p-1'>
        <h1 className='text-lg text-blue-600'> {name}</h1>
        {
          paid ?
            <h1>Price: {currencyFormaterClient({ amount: price, currency: "usd" })}</h1>
            :
            <h1>Free</h1>
        }
        <p className='line-clamp-3 text-xs text-gray-400'>{description}</p>
        <Badge text={category} />
      </div>
    </div>
  )
}

