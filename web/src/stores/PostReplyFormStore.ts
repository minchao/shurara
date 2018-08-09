import {action, observable} from "mobx"

import api from "../services/API"

export default class PostReplyFormStore {

    @observable public boardId: string
    @observable public postId: string
    @observable public name: string
    @observable public body: string
    @observable public error: boolean = false

    @action
    public reset() {
        this.boardId = ""
        this.postId = ""
        this.name = ""
        this.body = ""
        this.error = false
    }

    @action
    public setBoardId(id: string) {
        this.boardId = id
    }

    @action
    public setPostId(id: string) {
        this.postId = id
    }

    @action
    public setName(name: string) {
        this.name = name
    }

    @action
    public setBody(body: string) {
        this.body = body
    }

    @action
    public setError(error: boolean) {
        this.error = error
    }

    public post(cb: (json: object, error: object) => void) {
        api.postComment({
            boardId: this.boardId,
            body: this.body,
            name: this.name,
            postId: this.postId,
        }, cb)
    }
}
