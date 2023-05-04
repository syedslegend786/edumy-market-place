export const serializeJsonObject = (data: any) => {
    return JSON.parse(JSON.stringify(data))
}