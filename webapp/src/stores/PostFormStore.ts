import {action, observable} from "mobx"

import api from "../services/API"

export default class PostFormStore {

    @observable public topicId: string

    @observable public name: string

    @observable public content: string

    @observable public photo?: File

    @observable public error: boolean = false

    @action public reset() {
        this.topicId = ""
        this.name = ""
        this.content = ""
        this.photo = undefined
        this.error = false
    }

    @action public setName(name: string) {
        this.name = name
    }

    @action public setContent(content: string) {
        this.content = content
    }

    @action public setPhoto(photo: any) {
        this.photo = photo
    }

    @action public setError(error: boolean) {
        this.error = error
    }

    public post(cb: (json: object, error: object) => void) {
        api.postPost({
            content: this.content,
            name: this.name,
            photo: this.photo,
            topicId: this.topicId,
        }, cb)
    }
}
