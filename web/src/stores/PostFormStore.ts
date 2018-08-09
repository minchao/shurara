import {action, observable} from "mobx"

import api from "../services/API"

export default class PostFormStore {

    @observable public board: string
    @observable public name: string
    @observable public body: string
    @observable public image?: File
    @observable public error: boolean = false

    @action
    public reset() {
        this.board = ""
        this.name = ""
        this.body = ""
        this.image = undefined
        this.error = false
    }

    @action
    public setBoard(board: string) {
        this.board = board
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
    public setImage(image: any) {
        this.image = image
    }

    @action
    public setError(error: boolean) {
        this.error = error
    }

    public post(cb: (json: object, error: object) => void) {
        api.postPost({
            board: this.board,
            body: this.body,
            image: this.image,
            name: this.name,
        }, cb)
    }
}
