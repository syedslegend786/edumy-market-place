import { instructorLinksData } from '@/data/linksData'
import { useRouter } from 'next/router'
import React from 'react'
interface InstructorLayoutProps {
    children: React.ReactElement
}


export const InstructorLayout = ({ children }: InstructorLayoutProps) => {
    const router = useRouter()
    return (
        <div>
            {
                instructorLinksData.map((link, i) => (
                    <span
                        className='bg-blue-600 text-white p-2 rounded-md m-3 cursor-pointer'
                        key={i} onClick={() => router.push(link.link)}
                    >
                        {link.text}
                    </span>
                ))
            }
            {children}
        </div>
    )
}


