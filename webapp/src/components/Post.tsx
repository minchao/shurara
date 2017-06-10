import {observer} from "mobx-react"
import * as moment from "moment"
import * as React from "react"
import {Comment, Item} from "semantic-ui-react"

import PostModel from "../models/PostModel"
import PostComment from "./PostComment"

interface IProps {
    post?: PostModel
}

@observer
export default class Post extends React.Component<IProps, any> {
    public render() {
        const post = this.props.post

        return (
            <Item>
                {post.type === "photo" && (
                    <Item.Image
                        src={post.photos[0].original.url}
                        size="medium"
                    />
                )}

                <Item.Content>
                    <Item.Header>
                        {post.user.name}
                        <span className="postTimestamp">{moment(post.timestamp).fromNow()}</span>
                    </Item.Header>
                    <Item.Description>{post.body}</Item.Description>

                    {post.comments.length > 0 &&
                        <Comment.Group>
                        {post.comments.map((comment) => (
                            <PostComment comment={comment} key={comment.user.id + comment.timestamp}/>
                        ))}
                        </Comment.Group>
                    }
                </Item.Content>
            </Item>
        )
    }
}
