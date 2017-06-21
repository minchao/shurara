import {action, observable} from "mobx"

import {IBoard, IPaging} from "../models/BoardModel"
import PostModel from "../models/PostModel"
import api, {IError} from "../services/API"

export default class BoardStore {
    public static fromJS(js): BoardStore {
        const store = new BoardStore()
        store.fromJS(js)
        return store
    }

    public location: string

    @observable public loading: boolean = false
    @observable public board: IBoard
    @observable public posts: PostModel[] = []
    @observable public paging?: IPaging

    @action
    public reset() {
        this.board = undefined
        this.posts = []
        this.paging = undefined
    }

    @action
    public fromJS(js: any) {
        this.board = js.board
        this.posts = js.posts.map((post) => {
            return PostModel.fromJS(post)
        })
        this.paging = js.paging
    }

    @action
    public fetch(boardId: string, query: string) {
        this.loading = true
        api.getBoard(boardId, query, (json: object, error?: IError) => {
            if (error === undefined) {
                this.fromJS(json)
            } else {
                this.reset()
            }
            this.loading = false
        })
    }
}
