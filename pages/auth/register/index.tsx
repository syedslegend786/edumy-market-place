import { registerApi } from '@/services/api/auth';
import { Button, Input } from '@/ui'
import { handleFrontEndResponse } from '@/utils/apiresponses';
import { Formik, ErrorMessage } from 'formik';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import React from 'react'
import * as Yup from 'yup';
const SigninSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email.").required("email is required."),
    password: Yup.string().required("password is required.")
});
interface IFormValues {
    email: string
    password: string,
    name: string,
}
const Register = () => {
    const intialValues: IFormValues = { email: '', password: '', name: "" }
    return (
        <div>
            <h1>sign up</h1>
            <Formik
                validationSchema={SigninSchema}
                initialValues={intialValues}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        const res = await registerApi({
                            ...values
                        })
                        alert("created successfully.")
                    } catch (error) {
                        const err = handleFrontEndResponse(error)
                        alert(err)
                    }
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Input placeholder='Name...' onChange={handleChange} value={values.name} name='name' />
                        <ErrorMessage className='text-red-700 text-xs my-2' name='name' component={"div"} />
                        <Input placeholder='Email...' onChange={handleChange} value={values.email} name='email' />
                        <ErrorMessage className='text-red-700 text-xs my-2' name='email' component={"div"} />
                        <Input placeholder='Password...' value={values.password} onChange={handleChange} name='password' />
                        <ErrorMessage className='text-red-700 text-xs my-2' name='password' component={"div"} />
                        <Button type='submit' text='SIGN UP' />
                        <div>
                            <Link href='/auth/login'>Login</Link>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    )
}

export default Register