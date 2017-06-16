export interface IError {
    error: string
    error_description?: string
}

export interface IBoardPostBody {
    board: string
    name: string
    body: string
    image?: File
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

    public getBoardByPath(path: string, callback: (json: object, error?: IError) => void) {
        const paths = path.split("?")
        const board = paths[0].replace("/", "")
        const query = (paths.length > 1) ? `?${paths[1]}` : ""
        this.getBoard(board, query, callback)
    }

    public postBoardPost(post: IBoardPostBody, callback: (json: object, error?: IError) => void) {
        const data = new FormData()
        data.append("name", post.name)
        data.append("body", post.body)
        if (post.image !== undefined) {
            data.append("image", post.image)
        }

        this.fetch(`/api/boards/${post.board}/posts`, {method: "post", body: data}, callback)
    }
}

const api = new API()

export default api
