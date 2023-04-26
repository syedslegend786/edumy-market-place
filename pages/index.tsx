import { UserPagesLayout } from "@/layouts"
import { useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()
  console.log({ session })
  return (
    <UserPagesLayout>
      <div>user layou</div>
    </UserPagesLayout>
  )
}
