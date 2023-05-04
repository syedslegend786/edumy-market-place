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


] as ILinks[]