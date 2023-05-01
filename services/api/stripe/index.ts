import { axios } from '../axios'



export const verifyInstructorApi = async () => {
    const { data } = await axios.post("/stripe/verify-instructor")
    return data
}