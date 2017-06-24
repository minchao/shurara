import {observer} from "mobx-react"
import * as moment from "moment"
import * as React from "react"
import {Comment, Header, Item} from "semantic-ui-react"

import PostModel, {IImage} from "../models/PostModel"
import PostComment from "./PostComment"
import PostReply from "./PostReply"
import {Text} from "./Text"

interface IProps {
    post: PostModel
    openModal: (src: string) => void
}

@observer
export default class Post extends React.Component<IProps, any> {
    public render() {
        const post = this.props.post
        const getThumbnail = (image: IImage, size: number): string => {
            if (image.thumbnails.length > 0) {
                const thumbnail = image.thumbnails.find((t) => t.width === size)
                if (thumbnail) {
                    return thumbnail.url
                }
            }
            return image.original.url
        }

        return (
            <Item>
                {post.type === "image" && (
                    <Item.Image
                        src={getThumbnail(post.images[0], 300)}
                        size="medium"
                        onClick={() => this.props.openModal(getThumbnail(post.images[0], 1024))}
                    />
                )}

                <Item.Content>
                    <Item.Header>
                        {post.user.name}
                        <span className="postTimestamp">{moment(post.timestamp).fromNow()}</span>
                    </Item.Header>
                    <Item.Description style={{marginBottom: 20}}>
                        <Text message={post.body}/>
                    </Item.Description>

                    {post.comments.length > 0 &&
                        <Comment.Group>
                            <div className="commentHeader">{post.comments.length} comments</div>
                        {post.comments.map((comment) => (
                            <PostComment comment={comment} key={comment.user.id + comment.timestamp}/>
                        ))}
                        </Comment.Group>
                    }

                    <PostReply post={post}/>
                </Item.Content>
            </Item>
        )
    }
}
