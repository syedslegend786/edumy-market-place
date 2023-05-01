import React from 'react'
import { Course } from '@prisma/client'
import { ErrorMessage, Formik } from 'formik'
import { Button, Input } from '@/ui'
import * as Yup from 'yup'
import { createCourseApi } from '@/services/api'
import { handleFrontEndResponse } from '@/utils/apiresponses'
import { InstructorLayout } from '@/layouts'
const prices = [
    "9.99",
    "19.99",
    "29.99",
    "39.99",
    "49.99",
]
interface IInitialValues {
    category: string,
    description: string,
    name: string,
    paid: boolean,
    price: string
    file: File | null
}

const initialValues: IInitialValues = {
    category: "",
    description: "",
    name: "",
    paid: true,
    price: "9.99",
    file: null
}

const CreateCourseSchema = Yup.object().shape({
    name: Yup.string().required(),
    category: Yup.string().required(),
    description: Yup.string().required(),
    paid: Yup.boolean().required(),
    price: Yup.string().required(),

});
const CreateCourses = () => {
    return (
        <InstructorLayout>
            <Formik
                validationSchema={CreateCourseSchema}
                initialValues={initialValues}
                onSubmit={async (values, actions) => {
                    try {
                        await createCourseApi({
                            category: values.category,
                            description: values.description,
                            imagePreview: values.file!,
                            name: values.name,
                            paid: values.paid,
                            price: Number(values.price)
                        })
                        alert("created successfully!")
                    } catch (error: any) {
                        const err = handleFrontEndResponse(error)
                        alert(err)
                    }
                }}
            >
                {
                    ({
                        handleChange,
                        values,
                        setValues,
                        handleSubmit,
                        setFieldValue
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Input placeholder='Name' value={values.name} name='name' onChange={handleChange} />
                            <ErrorMessage className='text-red-700 text-xs my-2' name='name' component={"div"} />
                            <Input placeholder='Description' value={values.description} name='description' onChange={handleChange} />
                            <ErrorMessage className='text-red-700 text-xs my-2' name='description' component={"div"} />
                            <label htmlFor="price">Price</label>
                            <select id='price' name='price' onChange={handleChange} value={values.price}>
                                {
                                    prices.map((p, pi) => (
                                        <option key={pi} value={p}>{p}</option>
                                    ))
                                }
                            </select>
                            <label htmlFor="type">Type</label>
                            <div id='type' className='flex items-center'>
                                <h1>paid</h1>
                                <input onChange={() => { setFieldValue("paid", true) }} type="radio" checked={values.paid} />
                                <h1>free</h1>
                                <input onChange={() => { setFieldValue("paid", false) }} type="radio" checked={!values.paid} />
                            </div>
                            <ErrorMessage className='text-red-700 text-xs my-2' name='price' component={"div"} />
                            <Input value={values.category} name='category' onChange={handleChange} />
                            <ErrorMessage className='text-red-700 text-xs my-2' name='category' component={"div"} />
                            <input type="file" onChange={(e) => {
                                if (!e.target.files) {
                                    return;
                                }
                                const file = e.target.files[0]

                                setFieldValue("file", file)
                            }} />
                            <ErrorMessage className='text-red-700 text-xs my-2' name='file' component={"div"} />
                            <img className='h-10 w-10' src={values.file ? URL.createObjectURL(values.file) : ""} alt="" />
                            <Button type='submit' text='Submit' />
                        </form>
                    )
                }
            </Formik>
        </InstructorLayout>
    )
}

export default CreateCourses