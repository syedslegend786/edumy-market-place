import { makeInstructorApi } from '@/services/api/instructor'
import { Button } from '@/ui'
import { handleFrontEndResponse } from '@/utils/apiresponses'
import clsx from 'clsx'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { AiOutlineUser } from 'react-icons/ai'
import { FiSettings } from 'react-icons/fi'

interface UserPagesProps {
    children: React.ReactElement
}
const instructorRoutes = [{
    title: "Create Courses",
    to: "/instructor"
}] as { title: string, to: string }[]

const UserPagesLayout = ({ children }: UserPagesProps) => {
    const router = useRouter()
    const [showMenu, setshowMenu] = useState(false)
    const { data: session } = useSession()
    const handleBecomeInstructor = async () => {
        try {
            const data = await makeInstructorApi()
            window.location.href = data.data.url
        } catch (error: any) {
            const err = handleFrontEndResponse(error)
            alert(err)
        }
    }
    return (
        <div className=''>
            <div className='flex justify-between p-3'>
                <div>
                    <Button text='Home' onClick={() => { router.push("/") }} />
                </div>
                <div className='flex items-center gap-x-5'>
                    {
                        session?.user &&
                        <div className='flex items-center'>
                            <AiOutlineUser size={20} />
                            {
                                session?.user?.name &&
                                <h1 className='text-sm font-semibold text-gray-600'>{session?.user?.name}</h1>
                            }
                        </div>
                    }
                    {
                        session?.user ?
                            <Button onClick={() => { signOut() }} text='Logout' />
                            :
                            <Button onClick={() => { router.push(`/auth/login`) }} text='Login' />
                    }
                    <div className=' relative'>
                        <FiSettings onClick={() => { setshowMenu(!showMenu) }} className='cursor-pointer' size={20} />
                        <div
                            className={clsx(
                                'hidden  bg-gray-500 shadow-md p-2 right-0  h-[200px]  w-[200px]',
                                {
                                    "!absolute !inline z-10": showMenu
                                }
                            )}>
                            {
                                session?.user.roles.includes("instructor") ?
                                    instructorRoutes.map((r, ri) => (
                                        <Link href={r.to} key={ri} className='hover:bg-green-600 hover:text-white p-2 text-white cursor-pointer text-xs'>{r.title}</Link>
                                    ))
                                    :
                                    <>
                                        <h1
                                            onClick={handleBecomeInstructor}
                                            className='hover:bg-green-600 !w-full hover:text-white p-2 text-white cursor-pointer text-xs'
                                        >
                                            Become Instructor
                                        </h1>
                                        <h1
                                            onClick={()=>{
                                                router.push('/course/mylearning/list')
                                            }}
                                            className='hover:bg-green-600 !w-full hover:text-white p-2 text-white cursor-pointer text-xs'
                                        >
                                            My Learnings
                                        </h1>
                                    </>
                            }
                        </div>
                    </div>
                </div>
            </div>
            {children}
        </div >
    )
}

export { UserPagesLayout }