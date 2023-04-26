import { axios } from '../axios'



export const makeInstructorApi = async () => {
    const res = await axios.post('/instructor/make-instructor')
    return res.data
}

export const varifyInstructorApi = async () => {
    const res = await axios.post("/instructor/make-instructor")
    return res.data
}