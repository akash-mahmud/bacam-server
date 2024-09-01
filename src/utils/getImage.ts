export const getImage = (key: string) => {
    if (key) {
        return process.env.IMAGE_URL + key
    }
}