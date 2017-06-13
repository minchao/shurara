export interface IError {
    error: string
    errorMessage?: string
}

class API {
    public postPost(post: any, callback: (json: object, error?: IError) => void) {
        // TODO
        setTimeout(() => {
            if (!post.content) {
                callback({}, {error: "bad_request"})
                return
            }
            callback({}, null)
        }, 500)
    }
}

const api = new API()

export default api
