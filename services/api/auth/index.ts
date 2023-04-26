import { axios } from '../axios'
import { User } from '@prisma/client'

interface ILoginDTO {
    email: string
    password: string
}
export const login = async (data: ILoginDTO) => {
    axios.post("")
}

export type RegisterDTO = Pick<User, "email" | "name" | "password">
export const registerApi = async (data: RegisterDTO) => {
    const res = await axios.post("/auth/register", data)
    return res.data
}