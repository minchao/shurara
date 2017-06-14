export interface IError {
    error: string
    errorDescription?: string
}

class API {
    public postPost(post: any, callback: (json: object, error?: IError) => void) {
        const data = new FormData()
        data.append("name", post.name)
        data.append("content", post.content)
        data.append("photo", post.photo)

        fetch(
            API_HOST + "/api/post",
            {
                body: data,
                method: "post",
            },
        ).then(
            (res) => {
                if (res.ok) {
                    callback(res.json())
                } else {
                    callback(res.json(), {error: "bad_request"})
                }
            },
        ).catch(
            (error) => {
                callback({}, {error: "exception", errorDescription: error})
            },
        )
    }
}

const api = new API()

export default api
