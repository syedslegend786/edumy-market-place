import { Button, Input } from '@/ui'
import { Formik, ErrorMessage } from 'formik';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import React from 'react'
import * as Yup from 'yup';
import { useSearchParams } from 'next/navigation'
const SigninSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email.").required("email is required."),
  password: Yup.string().required("password is required.")
});
interface IFormValues {
  email: string
  password: string
}
const Login = () => {
  const searchParam = useSearchParams()
  const intialValues: IFormValues = { email: '', password: '' }
  return (
    <div>
      <h1>sign in</h1>
      <Formik
        validationSchema={SigninSchema}
        initialValues={intialValues}
        onSubmit={async (values, { setSubmitting }) => {
          const res = await signIn("credentials", {
            ...values,
            redirect: false,
          })
          if (res?.error) {
            return alert(res.error)
          }
          if (res?.ok) {
            const from = searchParam.get("from")
            if (from) {
              window.location.href = `${from}`
            } else {
              window.location.href = "/"
            }
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
            <Input onChange={handleChange} value={values.email} name='email' />
            <ErrorMessage className='text-red-700 text-xs my-2' name='email' component={"div"} />
            <Input value={values.password} onChange={handleChange} name='password' />
            <ErrorMessage className='text-red-700 text-xs my-2' name='password' component={"div"} />
            <Button type='submit' text='SIGN IN' />
            <div>
              <Link href='/auth/register'>Register</Link>
            </div>
          </form>
        )}
      </Formik>
    </div>
  )
}

export default Login