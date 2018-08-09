import {action, observable} from "mobx"
import {inject, observer} from "mobx-react"
import * as React from "react"
import {Button, Form, Message} from "semantic-ui-react"

import PostModel from "../models/PostModel"
import {IError} from "../services/API"
import BoardStore from "../stores/BoardStore"
import PostReplyFormStore from "../stores/PostReplyFormStore"

interface IProps {
    board?: BoardStore
    post: PostModel
}

@inject("board")
@observer
export default class PostReply extends React.Component<IProps, any> {

    public form = new PostReplyFormStore()

    @observable private open: boolean = false

    @observable private loading: boolean = false

    public render() {
        const errorMessage = (
            <Message negative>
                <Message.Header>Reply failed</Message.Header>
            </Message>
        )

        return (
            <div>
                {!this.open &&
                <Button
                    content="Reply"
                    icon="edit"
                    size="tiny"
                    onClick={this.handleOpen}
                />
                }
                {this.form.error && errorMessage}
                {this.open &&
                <Form
                    reply
                    onSubmit={(e) => e.preventDefault()}
                >
                    <Form.Field>
                        <input
                            placeholder="Your Name"
                            onChange={this.handleNameChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Form.TextArea
                            placeholder="Your text here"
                            onChange={this.handleBodyChange}
                        />
                    </Form.Field>
                    <Button
                        content="Cancel"
                        size="small"
                        disabled={this.loading}
                        onClick={this.handleClose}
                    />
                    <Button
                        primary
                        content="Submit"
                        size="tiny"
                        disabled={this.loading}
                        loading={this.loading}
                        onClick={this.handleSubmit}
                    />
                </Form>
                }
            </div>
        )
    }

    @action private handleOpen = () => {
        this.form.reset()
        this.form.setBoardId(this.props.board.board.slug)
        this.form.setPostId(this.props.post.id)
        this.open = true
        this.loading = false
    }

    @action private handleClose = () => {
        this.open = false
        this.form.reset()
    }

    @action private handleSubmit = () => {
        if (this.form.body === "") {
            this.form.setError(true)
            return
        }
        this.loading = true
        this.form.post((json: any, error?: IError) => {
            this.loading = false
            if (error === undefined) {
                this.props.board.updatePost(PostModel.fromJS(json))
                this.handleClose()
            } else {
                this.form.setError(true)
            }
        })
    }

    private handleNameChange = (event: any) => {
        this.form.setName(event.target.value.trim())
    }

    private handleBodyChange = (event: any) => {
        this.form.setBody(event.target.value.trim())
    }
}
