import {action, observable} from "mobx"

import {IBoard, IPaging} from "../models/BoardModel"
import PostModel from "../models/PostModel"

export default class BoardStore {
    public static fromJS(js): BoardStore {
        const store = new BoardStore()
        store.board = js.board
        store.posts = js.posts.map((post) => {
            return PostModel.fromJS(post)
        })
        store.paging = js.paging
        return store
    }

    @observable public board: IBoard
    @observable public posts: PostModel[] = []
    @observable public paging?: IPaging
}
