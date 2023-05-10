interface ILinks {
    text: string,
    link: string,
}


export const instructorLinksData = [
    {
        link: "/",
        text: "Home"
    },
    {
        link: "/instructor/course/create",
        text: "Create Course"
    },
    {
        link: "/instructor",
        text: "Dashboard"
    },
    {
        text: "Rvenue",
        link: "/instructor/revenue"
    }


] as ILinks[]