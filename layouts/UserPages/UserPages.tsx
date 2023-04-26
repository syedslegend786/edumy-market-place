import { makeInstructorApi } from '@/services/api/instructor'
import { Button } from '@/ui'
import { handleFrontEndResponse } from '@/utils/apiresponses'
import React from 'react'


interface UserPagesProps {
    children: React.ReactElement
}
const UserPagesLayout = ({ children }: UserPagesProps) => {
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
        <div>
            <div>
                <Button onClick={handleBecomeInstructor} text='Become Instructor' />
            </div>
            {children}
        </div>
    )
}

export { UserPagesLayout }