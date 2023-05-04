import { UserPagesLayout } from '@/layouts'
import { MyListingCourseCard, MyListingCourseCardProps } from '@/molecules'
import { axios } from '@/services/api/axios'
import { Enrolled } from '@prisma/client'
import React from 'react'
import { useMutation, useQuery } from 'react-query'
const List = () => {
    const { data, error, isLoading } = useQuery<{
        data: { courses: MyListingCourseCardProps[] }
    }>({
        queryKey: ["fetch-enrolled-courses"],
        queryFn: async () => {
            const { data } = await axios.get(`/course/getalluserenrolledcourses`)
            return data
        }
    })
    return (
        <UserPagesLayout>
            <div>
                {
                    isLoading ?
                        <div>loading...</div>
                        : error ?
                            <div>{JSON.stringify(error)}</div>
                            :
                            <div className='px-3 space-y-3'>
                                {
                                    data?.data.courses.map((course, index) => (
                                        <MyListingCourseCard {...course} key={index} />
                                    ))
                                }
                            </div>
                }
            </div>
        </UserPagesLayout>
    )
}

export default List