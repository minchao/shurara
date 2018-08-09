import {observable} from "mobx"

export interface IUser {
    id: string
    name: string
}

export interface IImage {
    original: IImageItem
    thumbnails: IImageItem[]
}

export interface IImageItem {
    url: string
    width: number
    height: number
}

export interface IComment {
    type: string
    timestamp: number
    user: IUser
    body: string
}

export default class PostModel {
    public static fromJS(js: any): PostModel {
        const post = new PostModel()
        post.id = js.id
        post.user = js.user
        post.type = js.type
        post.timestamp = js.timestamp
        post.body = js.body
        post.images = js.images
        post.comments = js.comments
        return post
    }

    @observable public id: string
    @observable public user: IUser
    @observable public type: string
    @observable public timestamp: number
    @observable public body: string
    @observable public images?: IImage[]
    @observable public comments: IComment[]
}
