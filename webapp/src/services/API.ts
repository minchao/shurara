export interface IError {
    error: string
    error_description?: string
}

class API {
    public fetch(url: string, object: object, callback: (json: object, error?: IError) => void) {
        fetch(
            API_HOST + url,
            object,
        ).then(
            (res) => {
                if (res.ok) {
                    return res.json().then((json) => callback(json))
                } else if (res.status >= 400 && res.status <= 499) {
                    return res.json().then((json) => callback({}, json))
                }

                throw new Error(res.statusText)
            },
        ).catch(
            (error) => {
                callback({}, {error: "exception", error_description: error})
            },
        )
    }

    public getBoard(boardId: string, callback: (json: object, error?: IError) => void) {
        this.fetch(`/api/boards/${boardId}`, {method: "get"}, callback)
    }

    public postBoardPost(post: any, callback: (json: object, error?: IError) => void) {
        const data = new FormData()
        data.append("name", post.name)
        data.append("content", post.content)
        if (post.photo !== undefined) {
            data.append("photo", post.photo)
        }

        this.fetch(`/api/boards/${post.board}/posts`, {method: "post", body: data}, callback)
    }
}

const api = new API()

export default api
