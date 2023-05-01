import { axios } from '@/services/api/axios'
import { handleFrontEndResponse } from '@/utils/apiresponses'
import { ErrorMessage, Formik, FormikHelpers } from 'formik'
import React, { useState } from 'react'
import * as Yup from 'yup'
import { Lesson } from '@prisma/client'
import { Button, Input } from '@/ui'
import { GetServerSideProps } from 'next'
type TDbValues = Pick<Lesson, "name" | "description" | "courseId">
interface IInitialValue extends TDbValues {
    video: File | null,

}

const formValidationSchema = Yup.object().shape({
    description: Yup.string().required(),
    name: Yup.string().required(),
    video: Yup.mixed().nullable().required("file is required")
})
interface CreateLessonProps {
    courseId: string
}
const CreateLesson = ({ courseId }: CreateLessonProps) => {
    const initialValues: IInitialValue = {
        video: null,
        description: "",
        name: "",
        courseId: courseId
    }
    const [progress, setprogress] = useState(0)
    return (
        <div>
            <h1 className='text-xl font-bold'>{progress}%</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={formValidationSchema}
                onSubmit={async (values) => {
                    const formData = new FormData()
                    Object.entries(values).forEach(([key, value]) => {
                        formData.append(`${key}`, value)
                    })
                    try {
                        await axios.post('/instructor/lesson/create', formData, {
                            onUploadProgress: (e) => {
                                if (!e.total) {
                                    return;
                                }
                                setprogress(
                                    Math.round(
                                        (100 * e.loaded) / e.total
                                    )
                                )
                            }
                        })
                        alert("Lesson Created Successfully!")
                    } catch (error: any) {
                        const err = handleFrontEndResponse(error)
                        alert(err)
                    }
                }}
            >
                {({
                    setFieldValue,
                    values,
                    handleSubmit,
                    handleChange
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Input name='name' placeholder='Name...' value={values.name} onChange={handleChange} />
                        <ErrorMessage className='text-red-700 text-xs my-2' name='name' component={"div"} />
                        <Input name='description' placeholder='Description...' value={values.description} onChange={handleChange} />
                        <ErrorMessage className='text-red-700 text-xs my-2' name='description' component={"div"} />

                        <input type='file' onChange={async (e) => {
                            if (!e.target.files) {
                                return;
                            }
                            const file = e.target.files[0]
                            setFieldValue("video", file)
                        }} />
                        <ErrorMessage className='text-red-700 text-xs my-2' name='video' component={"div"} />
                        <Button type='submit' text='Create' />
                    </form>
                )}
            </Formik>
        </div>
    )
}

export default CreateLesson


export const getServerSideProps: GetServerSideProps<CreateLessonProps> = async (ctx) => {
    const courseId = ctx.params?.cid as string
    return {
        props: {
            courseId
        }
    }
}