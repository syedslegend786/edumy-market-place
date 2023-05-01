import { verifyInstructorApi } from '@/services/api'
import { handleFrontEndResponse } from '@/utils/apiresponses'
import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'

const CreateCallBack = () => {

  const { data: session } = useSession()
  const vrify = async () => {
    try {
      await verifyInstructorApi()
      window.location.href = "/"
    } catch (error: any) {
      const err = handleFrontEndResponse(error)
      alert(err)
    }
  }
  useEffect(() => {
    if (session?.user) {
      vrify()
    }
  }, [session?.user])
  return (
    <div>CreateCallBack</div>
  )
}

export default CreateCallBack

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {

    }
  }
}