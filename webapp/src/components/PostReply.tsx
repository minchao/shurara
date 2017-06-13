import {action, observable} from "mobx"
import {observer} from "mobx-react"
import * as React from "react"
import {Button, Form} from "semantic-ui-react"

import PostModel from "../models/PostModel"

interface IProps {
    post: PostModel
}

@observer
export default class PostReply extends React.Component<IProps, any> {

    @observable private open: boolean = false

    public render() {
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
                {this.open &&
                <Form
                    reply
                    onSubmit={(e) => e.preventDefault()}
                >
                    <Form.Field>
                        <input placeholder="Your Name" />
                    </Form.Field>
                    <Form.Field>
                        <Form.TextArea placeholder="Your text here" />
                    </Form.Field>
                    <Button
                        content="Cancel"
                        size="small"
                        onClick={this.handleClose}
                    />
                    <Button
                        primary
                        content="Submit"
                        size="tiny"
                    />
                </Form>
                }
            </div>
        )
    }

    @action private handleOpen = () => {
        this.open = true
    }

    @action private handleClose = () => {
        this.open = false
    }
}
