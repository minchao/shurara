import {action, observable} from "mobx"

import PostModel from "../models/PostModel"
import {IPaging, ITopic} from "../models/TopicModel"

export default class TopicStore {
    public static fromJS(js): TopicStore {
        const store = new TopicStore()
        store.topic = js.topic
        store.posts = js.posts.map((post) => {
            return PostModel.fromJS(post)
        })
        store.paging = js.paging
        return store
    }

    @observable public topic: ITopic
    @observable public posts: PostModel[] = []
    @observable public paging?: IPaging

    @action public setPaging(paging: IPaging) {
        this.paging = paging
    }
}
