import { InstructorLayout } from '@/layouts'
import { CourseCard } from '@/molecules'
import { getMyCreatedCoursesApi } from '@/services/api'
import { handleFrontEndResponse } from '@/utils/apiresponses'
import { Course } from '@prisma/client'
import React from 'react'
import { useQuery } from 'react-query'

const InstructorDashBoard = () => {
    const { isLoading, data, error } = useQuery<{
        data: Course[]
    }>("createdcourses", getMyCreatedCoursesApi)
    console.log("error", error)
    return (
        <InstructorLayout>
            <>
                {
                    error && <div className='text-red-600'>{handleFrontEndResponse(error)}</div>
                }
                {
                    isLoading && !data && !error && <div>Loading...</div>
                }
                {
                    !isLoading && data && <div className='grid grid-cols-2 p-5'>
                        {
                            data.data.map((course, idx) => (
                                <CourseCard key={idx} {...course} />
                            ))
                        }
                    </div>
                }

            </>
        </InstructorLayout>
    )
}

export default InstructorDashBoard