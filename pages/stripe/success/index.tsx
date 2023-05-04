import { UserPagesLayout } from '@/layouts'
import { axios } from '@/services/api/axios'
import { handleFrontEndResponse } from '@/utils/apiresponses'
import { useParams, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import * as  React from 'react'
import { useMutation } from 'react-query'
export interface VerifyCourseBoughtDTO {
  course_id: string
}
const Sucees = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cid = searchParams.get("cid")
  const verifyCourseBoughtMutation = useMutation({
    mutationFn: (data: VerifyCourseBoughtDTO) => {
      return axios.post(`/stripe/verify-course-bought`, data)
    },
    onSuccess: () => {
      const url = `/course/${cid}`
      router.replace(url)
    },
    onError: (error: any) => {
      const err = handleFrontEndResponse(error)
      alert(err)
    }
  })
  React.useEffect(() => {
    if (cid) {
      verifyCourseBoughtMutation.mutate({ course_id: cid })
    }
  }, [cid])
  return (
    <UserPagesLayout>
      <div></div>
    </UserPagesLayout>
  )
}

export default Sucees