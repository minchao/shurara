import {observer} from "mobx-react"
import * as moment from "moment"
import * as React from "react"
import {Comment} from "semantic-ui-react"

import {IComment} from "../models/PostModel"
import {Text} from "./Text"

interface IProps {
    comment?: IComment
}

@observer
export default class PostComment extends React.Component<IProps, any> {
    public render() {
        const comment = this.props.comment

        return (
            <Comment>
                <Comment.Content>
                    <Comment.Author as="a">{comment.user.name}</Comment.Author>
                    <Comment.Metadata>
                        <div>{moment(comment.timestamp).fromNow()}</div>
                    </Comment.Metadata>
                    <Comment.Text>
                        <Text message={comment.body}/>
                    </Comment.Text>
                </Comment.Content>
            </Comment>
        )
    }
}
