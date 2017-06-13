import {action, observable} from "mobx"

import api from "../services/API"

export default class PostFormStore {

    @observable public topicId: string

    @observable public title: string

    @observable public content: string

    @observable public error: boolean = false

    @action public reset() {
        this.topicId = ""
        this.title = ""
        this.content = ""
        this.error = false
    }

    @action public setTitle(title: string) {
        this.title = title
    }

    @action public setContent(content: string) {
        this.content = content
    }

    @action public setError(error: boolean) {
        this.error = error
    }

    public post(cb: (json: object, error: object) => void) {
        api.postPost({
            content: this.content,
            title: this.title,
            topicId: this.topicId,
        }, cb)
    }
}
