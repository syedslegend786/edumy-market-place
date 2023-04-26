import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'

const CreateCallBack = () => {
  
  const { data: session } = useSession()
  useEffect(() => {
    if (session?.user) {

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