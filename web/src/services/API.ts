export interface IError {
    error: string
    error_description?: string
}

export interface IPostForm {
    board: string
    name: string
    body: string
    image?: File
}

export interface ICommentForm {
    boardId: string
    postId: string
    name: string
    body: string
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

    public getBoard(boardId: string, query: string, callback: (json: object, error?: IError) => void) {
        if (!boardId) {
            boardId = "default"
        }
        this.fetch(`/api/boards/${boardId}${query}`, {method: "get"}, callback)
    }

    public postPost(post: IPostForm, callback: (json: object, error?: IError) => void) {
        const data = new FormData()
        data.append("name", post.name)
        data.append("body", post.body)
        if (post.image !== undefined) {
            data.append("image", post.image)
        }

        this.fetch(`/api/boards/${post.board}/posts`, {method: "post", body: data}, callback)
    }

    public postComment(post: ICommentForm, callback: (json: object, error?: IError) => void) {
        const data = new FormData()
        data.append("name", post.name)
        data.append("body", post.body)

        this.fetch(`/api/boards/${post.boardId}/posts/${post.postId}/comments`, {method: "post", body: data}, callback)
    }
}

const api = new API()

export default api
