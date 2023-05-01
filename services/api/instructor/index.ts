import { axios } from '../axios'
import { Course } from '@prisma/client'


export const makeInstructorApi = async () => {
    const res = await axios.post('/stripe/make-instructor')
    return res.data
}

export interface CreateCourseDto extends Omit<Course, "id" | "imagePreview" | "userId"> {
    imagePreview: File
}


export const createCourseApi = async (data: CreateCourseDto) => {
    const formdata = new FormData()
    Object.entries(data).forEach(([key, value]) => {
        formdata.append(`${key}`, value)
    })
    const res = await axios.post("/instructor/createcourse", formdata)
}

export const getMyCreatedCoursesApi = async () => {
    const res = await axios.get("/instructor/get-my-created-courses")
    return res.data
}

