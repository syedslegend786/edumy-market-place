import { UserPagesLayout } from "@/layouts"
import { db } from "@/lib/db"
import { UserCourseCard } from "@/molecules"
import { Course } from "@prisma/client"
import { GetServerSideProps } from "next"
import { useSession } from "next-auth/react"
interface HomeProps {
  courses: Course[]
}
export default function Home({ courses }: HomeProps) {
  const { data: session } = useSession()
  console.log({ session })
  return (
    <UserPagesLayout>
      <div className="grid grid-cols-4 gap-5">
       
        {
          courses.map((c, ci) => (
            <UserCourseCard {...c} key={ci} />
          ))
        }
      </div>
    </UserPagesLayout>
  )
}


export const getServerSideProps: GetServerSideProps<HomeProps> = async (ctx) => {
  const courses = await db.course.findMany()

  return {
    props: {
      courses
    }
  }
}
